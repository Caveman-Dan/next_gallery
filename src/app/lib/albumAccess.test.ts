import { describe, expect, it } from "vitest";
import type { DirectoryTree } from "directory-tree";
import type { AlbumAccess } from "@/lib/db/dbAccess";
import { albumPathAllowed, filterAlbumTree } from "./albumAccess";

const rootPath = "/albums";

const node = (path: string, children: DirectoryTree[] = []): DirectoryTree =>
  ({ name: path.split("/").pop() ?? "", path, children }) as DirectoryTree;

const albums = node(rootPath, [
  node(`${rootPath}/travel`, [
    node(`${rootPath}/travel/italy`, [node(`${rootPath}/travel/italy/rome`), node(`${rootPath}/travel/italy/venice`)]),
    node(`${rootPath}/travel/france`),
  ]),
  node(`${rootPath}/home`, [node(`${rootPath}/home/kitchen`)]),
]);

const names = (tree: DirectoryTree): string[] => (tree.children ?? []).map((child) => child.name);

describe("albumPathAllowed", () => {
  it("allows every path when access is all", () => {
    const access: AlbumAccess = { all: true };
    expect(albumPathAllowed("travel/italy", access)).toBe(true);
    expect(albumPathAllowed("", access)).toBe(true);
    expect(albumPathAllowed("missing", access)).toBe(true);
  });

  it("allows an exact grant and its descendants only", () => {
    const access: AlbumAccess = { all: false, paths: ["travel"] };
    expect(albumPathAllowed("travel", access)).toBe(true);
    expect(albumPathAllowed("travel/italy/rome", access)).toBe(true);
    expect(albumPathAllowed("home", access)).toBe(false);
    expect(albumPathAllowed("travel/france", { all: false, paths: ["travel/italy"] })).toBe(false);
  });

  it("normalises leading and trailing slashes", () => {
    const access: AlbumAccess = { all: false, paths: ["/travel/"] };
    expect(albumPathAllowed("/travel/italy/", access)).toBe(true);
  });

  it("denies everything when there are no grants", () => {
    expect(albumPathAllowed("travel", { all: false, paths: [] })).toBe(false);
  });
});

describe("filterAlbumTree", () => {
  it("returns the same tree when access is all", () => {
    const access: AlbumAccess = { all: true };
    expect(filterAlbumTree(albums, access)).toBe(albums);
  });

  it("keeps ancestor folders for a granted leaf and drops other branches", () => {
    const filtered = filterAlbumTree(albums, { all: false, paths: ["travel/italy/rome"] });
    expect(names(filtered)).toEqual(["travel"]);
    const travel = filtered.children?.[0];
    expect(names(travel!)).toEqual(["italy"]);
    expect(names(travel!.children![0])).toEqual(["rome"]);
  });

  it("keeps descendants of a granted folder", () => {
    const filtered = filterAlbumTree(albums, { all: false, paths: ["home"] });
    expect(names(filtered)).toEqual(["home"]);
    expect(names(filtered.children![0])).toEqual(["kitchen"]);
  });

  it("does not treat a visible ancestor as an allowed album", () => {
    // The parent stays in the tree so the leaf can be reached. It is still not a grant.
    const access: AlbumAccess = { all: false, paths: ["travel/italy/rome"] };
    expect(filterAlbumTree(albums, access).children?.[0].name).toBe("travel");
    expect(albumPathAllowed("travel", access)).toBe(false);
  });

  it("does not throw when children are missing", () => {
    expect(filterAlbumTree(node(rootPath), { all: false, paths: ["travel"] }).children).toEqual([]);
  });
});
