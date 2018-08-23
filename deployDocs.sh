# Make sure the script throws the error encountered
set -e

# Generate static files
npm run docs:build

# Enter the generated folder
cd docs/.vuepress/dist

# If it is posted to a custom domain name
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deployDocs'

# Deploy https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# Deploy https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -