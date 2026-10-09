// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { DirectoryTree } from "directory-tree";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import ProfileAlbumGrant from "./ProfileAlbumGrant";

vi.mock("@/lib/serverActions", () => ({
  adminReplaceProfileAlbums: vi.fn(async () => ({ ok: true })),
}));

import { adminReplaceProfileAlbums } from "@/lib/serverActions";

const rootPath = "/albums";
const node = (path: string, children: DirectoryTree[] = []): DirectoryTree =>
  ({ name: path.split("/").pop() ?? "", path, children }) as DirectoryTree;
const albums = node(rootPath, [
  node(`${rootPath}/travel`, [node(`${rootPath}/travel/italy`), node(`${rootPath}/travel/france`)]),
]);

const profile = (albumPaths: string[]): AccessProfileOption => ({
  id: 3,
  name: "Friends",
  isPublic: false,
  albumPaths,
});

describe("ProfileAlbumGrant", () => {
  afterEach(() => {
    cleanup();
  });

  it("checks a stored grant without the indeterminate dash", () => {
    render(
      <ProfileAlbumGrant
        profile={profile(["travel"])}
        albumPath="travel"
        albums={albums}
        rootPath={rootPath}
        onAlbumPathsChange={vi.fn()}
      />
    );
    const box = screen.getByRole("checkbox") as HTMLInputElement;
    expect(box.checked).toBe(true);
    expect(box.indeterminate).toBe(false);
  });

  it("checks an inherited child without the indeterminate dash", () => {
    render(
      <ProfileAlbumGrant
        profile={profile(["travel"])}
        albumPath="travel/italy"
        albums={albums}
        rootPath={rootPath}
        onAlbumPathsChange={vi.fn()}
      />
    );
    const box = screen.getByRole("checkbox") as HTMLInputElement;
    expect(box.checked).toBe(true);
    expect(box.indeterminate).toBe(false);
  });

  it("shows the indeterminate dash when only a descendant is stored", () => {
    render(
      <ProfileAlbumGrant
        profile={profile(["travel/italy"])}
        albumPath="travel"
        albums={albums}
        rootPath={rootPath}
        onAlbumPathsChange={vi.fn()}
      />
    );
    const box = screen.getByRole("checkbox") as HTMLInputElement;
    expect(box.checked).toBe(true);
    expect(box.indeterminate).toBe(true);
  });

  it("sends the next grant list and rolls back when the action fails", async () => {
    const onAlbumPathsChange = vi.fn();
    vi.mocked(adminReplaceProfileAlbums).mockResolvedValue({ ok: false });
    render(
      <ProfileAlbumGrant
        profile={profile([])}
        albumPath="travel/italy"
        albums={albums}
        rootPath={rootPath}
        onAlbumPathsChange={onAlbumPathsChange}
      />
    );
    await userEvent.setup().click(screen.getByRole("checkbox"));
    expect(onAlbumPathsChange).toHaveBeenNthCalledWith(1, ["travel/italy"]);
    expect(adminReplaceProfileAlbums).toHaveBeenCalledWith(3, ["travel/italy"]);
    expect(onAlbumPathsChange).toHaveBeenLastCalledWith([]);
  });
});
