#!/usr/bin/env bash
DIST_PATH=${TRAVIS_BUILD_DIR}/build
git config --global user.name "${GIT_NAME}"
git config --global user.email "${GIT_EMAIL}"
# переключаемся в текущую ветку
git checkout ${TRAVIS_BRANCH}
# переходим в директорию добавляе коммит
cd ${DIST_PATH} && git add -A && git commit -am "Travis build ${TRAVIS_BUILD_NUMBER}";
# отправляем коммит
git push ${REPO_URL} ${TRAVIS_BRANCH};