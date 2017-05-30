#!/bin/bash
# encoding: utf-8
 
DIST_PATH=${TRAVIS_BUILD_DIR}/actual-release
VERS=$(cat package.json | jq --raw-output '.version')
# переходим в директорию
cd ${TRAVIS_BUILD_DIR};
# копируем в неё репозиторий
git clone ${REPO_URL} actual-release;
# переходим в скопированный директорию репозитория, переключаемся в нужную ветку и чистим файлы
cd ${DIST_PATH} && git checkout release && rm -rf *;
# перемещаем файлы
cp -rp ${TRAVIS_BUILD_DIR}/build/* ${DIST_PATH};
cp -rp ${TRAVIS_BUILD_DIR}/docs/* ${DIST_PATH}/docs/;
cp -rp ${TRAVIS_BUILD_DIR}/package.json ${DIST_PATH};
cp -rp ${TRAVIS_BUILD_DIR}/composer.json ${DIST_PATH};
cp -rp ${TRAVIS_BUILD_DIR}/bower.json ${DIST_PATH};
cp -rp ${TRAVIS_BUILD_DIR}/README.md ${DIST_PATH};
cp -rp ${TRAVIS_BUILD_DIR}/CHANGELOG.md ${DIST_PATH};
cp -rp ${TRAVIS_BUILD_DIR}/LICENSE ${DIST_PATH};
# переходим в директорию добавляе коммит
cd ${DIST_PATH} && git add -A && git commit -am "Автоматическая сборка (${TRAVIS_BUILD_NUMBER})";
# создаём тег и отправляем коммит
if [ "$TRAVIS_BRANCH" == "master" ] 
then 
	git tag -a "v${VERS}" -m "Релиз версии ${VERS}"; 
	git push ${REPO_URL} release --tags;
fi
# или просто отправляем коммит
if [ "$TRAVIS_BRANCH" != "master" ]
then 
	git push ${REPO_URL} release;
fi
