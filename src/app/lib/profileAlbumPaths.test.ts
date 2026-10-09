import { describe, expect, it } from "vitest";
import type { DirectoryTree } from "directory-tree";
import { collectDescendantPaths, nextAlbumPaths, pathIsCovered, relativeAlbumPath } from "./profileAlbumPaths";

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

const sort = (paths: string[]) => [...paths].sort();

describe("relativeAlbumPath", () => {
  it("returns an empty string when the node is the root", () => {
    expect(relativeAlbumPath(rootPath, rootPath)).toBe("");
  });

  it("strips the root prefix, with or without a trailing slash", () => {
    expect(relativeAlbumPath(`${rootPath}/travel/italy`, rootPath)).toBe("travel/italy");
    expect(relativeAlbumPath(`${rootPath}/travel/italy`, `${rootPath}/`)).toBe("travel/italy");
  });

  it("returns the node path when it is not under the root", () => {
    expect(relativeAlbumPath("/other/place", rootPath)).toBe("/other/place");
  });
});

describe("pathIsCovered", () => {
  it("covers an exact grant and its descendants only", () => {
    expect(pathIsCovered("travel/italy", ["travel/italy"])).toBe(true);
    expect(pathIsCovered("travel/italy/rome", ["travel"])).toBe(true);
    expect(pathIsCovered("travel", ["travel/italy"])).toBe(false);
    expect(pathIsCovered("travel/italy", ["travel/france"])).toBe(false);
    expect(pathIsCovered("travel/italy", [])).toBe(false);
  });
});

describe("collectDescendantPaths", () => {
  it("returns every relative descendant, not the node itself", () => {
    expect(sort(collectDescendantPaths(albums, rootPath))).toEqual(
      sort([
        "travel",
        "travel/italy",
        "travel/italy/rome",
        "travel/italy/venice",
        "travel/france",
        "home",
        "home/kitchen",
      ])
    );
  });

  it("returns an empty list when there are no children", () => {
    expect(collectDescendantPaths(node(`${rootPath}/travel/france`), rootPath)).toEqual([]);
  });
});

describe("nextAlbumPaths", () => {
  it("adds a checked leaf", () => {
    expect(nextAlbumPaths([], "travel/italy/rome", true, albums, rootPath)).toEqual(["travel/italy/rome"]);
  });

  it("stores a folder instead of its descendants when that folder is checked", () => {
    const grants = ["travel/italy/rome", "travel/italy/venice"];
    expect(nextAlbumPaths(grants, "travel/italy", true, albums, rootPath)).toEqual(["travel/italy"]);
  });

  it("promotes the parent when the last uncovered sibling is checked", () => {
    const afterRome = nextAlbumPaths([], "travel/italy/rome", true, albums, rootPath);
    expect(nextAlbumPaths(afterRome, "travel/italy/venice", true, albums, rootPath)).toEqual(["travel/italy"]);
  });

  it("promotes to the highest fully covered folder", () => {
    const italy = nextAlbumPaths([], "travel/italy", true, albums, rootPath);
    expect(nextAlbumPaths(italy, "travel/france", true, albums, rootPath)).toEqual(["travel"]);
  });

  it("does not store a path already covered by an ancestor", () => {
    expect(nextAlbumPaths(["travel"], "travel/italy/rome", true, albums, rootPath)).toEqual(["travel"]);
  });

  it("removes a stored path and its stored descendants", () => {
    expect(nextAlbumPaths(["travel/italy", "travel/italy/rome"], "travel/italy", false, albums, rootPath)).toEqual([]);
  });

  it("expands a stored ancestor into the sibling subtrees that remain", () => {
    expect(sort(nextAlbumPaths(["travel"], "travel/italy/rome", false, albums, rootPath))).toEqual(
      sort(["travel/france", "travel/italy/venice"])
    );
  });

  it("removes a stored parent when its only child is unchecked", () => {
    expect(nextAlbumPaths(["home"], "home/kitchen", false, albums, rootPath)).toEqual([]);
  });

  it("leaves grants unchanged when the path is not stored and has no stored ancestor", () => {
    expect(nextAlbumPaths(["home"], "travel/france", false, albums, rootPath)).toEqual(["home"]);
  });
});
