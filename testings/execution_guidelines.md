# TESTING GUIDELINES (DO NOT change or modify any code, only run the tests indicated)

## LOGIN Guidelines

- Navigate to http://localhost:4200
- On the login screen, use the following credentians: email: opencode@test.com ; password: 123456
- Once logged, the home screen will be presented.
- If in page load, you are presented with home screen skipping login completely, login is taken as successful.

## TESTING Guidelines

- A folder under testings/{module_name} will contain a file {module_name}_template.md, this file includes all testings to execute.
- Using the current logged user, execute the tests indicated in the template file.
- Once a test or tests in the same date are performed, copy the template, in the same directory using {module_name}_results_{date}.md.
- Show the results of each test, also include  with ✅ / ❌ / ⚠️ icons on each result under pass/fail column.
- This results will be updated and included in the current date file.

## NOTES

- Do not try to login if already logged, check first where you are, as LOGING Guidelines suggest, it can be skipped.
- Do not wait much time to check if a page is loaded, first check if loaded on navigation, if not, then wait.