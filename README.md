# WADIZ-BACKEND

## 목차

-   [1. 데이터 수집](#1-데이터-수집)
-   [2. 데이터 DB에 적재](#2-데이터-db에-적재)
-   [3. 서버 실행](#3-서버-실행)

## 1. 데이터 수집

### 1-1. 캠페인 리스트 수집

-   기능

    응원참여자순으로 정렬된 캠페인 리스트(20개까지) 수집하여 파일로 저장, DB에 적재

-   실행

    ```
    node crawlers/campaign-list.js
    ```

-   데이터
    -   campaign-list.json
    -   campaign-images
-   DB
    -   campaigns

### 1-2. 모든 캠페인 댓글 수집

-   기능

    1-1에서 저장된 모든 캠페인의 댓글(20개까지) 수집하여 파일로 저장

-   실행

    ```
    node crawlers/comments.js
    ```

-   데이터
    -   comments.json

## 2. 데이터 DB에 적재

### 2-1. 캠페인

-   스키마

    ```javascript
    campaignId: { type: String, required: true },
    categoryName: { type: String, required: true },
    title: { type: String, required: true },
    totalBackedAmount: { type: Number, required: true },
    photoUrl: { type: String, required: true },
    nickName: { type: String, required: true },
    coreMessage: { type: String, required: true },
    whenOpen: { type: Date, required: true },
    achievementRate: { type: Number, required: true },
    ```

-   실행

    ```
    node model/Campaign.js
    ```

### 2-2. 댓글

-   스키마

    ```javascript
    body: { type: String, required: true },
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
    },
    commentType: { type: String },
    userNickname: { type: String }, // nickName
    whenCreated: { type: Date, required: true },
    commentReplys: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Comment",
        default: [],
    },
    depth: { type: Number, required: true, default: 0 },
    ```

-   실행

    ```
    node model/Comment.js
    ```

## 3. 서버 실행

```
npm run dev
```

127.0.0.1:3000 로 접속

### API

-   캠패인 조회 : GET `/api/campaign`
    -   response
        -   \_id
        -   campaignId
        -   categoryName
        -   title
        -   totalBackedAmount
        -   photoUrl
        -   nickName
        -   coreMessage
        -   whenOpen
        -   achievementRate
-   캠페인 id로 조회 : GET `/api/:campaignId`
    -   response
        -   \_id
        -   campaignId
        -   categoryName
        -   title
        -   totalBackedAmount
        -   photoUrl
        -   nickName
        -   coreMessage
        -   whenOpen
        -   achievementRate
        -   comments
-   캠페인 댓글 달기 : POST `/api/:campaignId/comment`

    -   request body
        -   body
        -   userNickname
    -   response
        -   body
        -   campaign
        -   userNickname
        -   whenCreated
        -   commentReplys
        -   depth
        -   \_id

-   캠페인 대댓글 달기 : POST `/api/:campaignId/comment/:commentId`
    -   request body
        -   body
        -   userNickname
    -   response
        -   body
        -   campaign
        -   userNickname
        -   whenCreated
        -   commentReplys
        -   depth
        -   \_id
