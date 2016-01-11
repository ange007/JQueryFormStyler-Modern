#!/usr/bin/env sh
DIST_PATH=${TRAVIS_BUILD_DIR}/build
# переходим в директорию
cd ${TRAVIS_BUILD_DIR};
# переключаемся в текущую ветку
git checkout ${TRAVIS_BRANCH};
# переходим в директорию
cd ${TRAVIS_BUILD_DIR};
# переходим в директорию добавляе коммит
git add -A && git commit -am "Travis build ${TRAVIS_BUILD_NUMBER}";
# отправляем коммит
git push ${REPO_URL} ${TRAVIS_BRANCH};
