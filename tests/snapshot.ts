export default {
  resolveTestPath: (path: string, extension: string) =>
    path.replace(extension, ''),
  resolveSnapshotPath: (path: string, extension: string) => path + extension,
  testPathForConsistencyCheck: '',
}
