# WADIZ-BACKEND

## 목차

-   [1. 데이터 수집](#1-데이터-수집)

## 1. 데이터 수집

### 1-1. 캠페인 리스트 수집

-   기능

    응원참여자순으로 정렬된 캠페인 리스트(20개까지) 수집

-   실행

    ```
    node crawlers/campaign-list.js
    ```

-   데이터
    -   campaign-list.json
    -   campaign-images

### 1-2. 모든 캠페인 댓글 수집

-   기능

    1-1에서 저장된 모든 캠페인의 댓글(20개까지) 수집

-   실행

    ```
    node crawlers/comments.js
    ```

-   데이터
    -   comments.json
