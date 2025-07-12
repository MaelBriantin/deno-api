const graphqlTypeFilePath = "./src/shared/graphql/types/";

/**
 * Extracts GraphQL type definitions from a list of file objects.
 *
 * Each file object is a mapping from a key to a filename. The function reads the contents
 * of each file located at `./src/shared/graphql/types/{filename}` and returns an object
 * mapping each key to its corresponding file content.
 *
 * @param files - An array of objects, each mapping keys to filenames.
 * @returns An object mapping each key to the contents of its corresponding GraphQL type file.
 *
 * @throws {Deno.errors.NotFound} If any of the specified files do not exist.
 * @throws {Deno.errors.PermissionDenied} If the process does not have permission to read the files.
 *
 * @example
 * const { rootTypes, userTypes, errorTypes } = graphqlTypeExtractor([
 *   { rootTypes: "_root.graphql" },
 *   { userTypes: "user.graphql" },
 *   { errorTypes: "error.graphql" },
 * ]);
 */
export function graphqlTypesExtractor(
  files: Array<Record<string, string>>,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const fileObj of files) {
    for (const [key, filename] of Object.entries(fileObj)) {
      const path = `${graphqlTypeFilePath}${filename}`;
      result[key] = Deno.readTextFileSync(path);
    }
  }
  return result;
}
