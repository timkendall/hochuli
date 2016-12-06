/**
  Note: Set the PWD to the root of the project (see package.json where we set the ENV variable)
  We need to do this to get `babel-plugin-module-resolver` working with Ava. The issue
  is that Ava changes the PWD to each tests location.
*/
process.chdir(process.env.PWD)
