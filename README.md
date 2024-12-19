# WHAT: Web History AI Tool

![./img/logo.png](./img/logo.png)

WHAT은 LLM을 통해 방문했던 페이지를 빠르게 검색하고 확인할 수 있게 도와주는 Chrome 확장 프로그램입니다. 

# 소개

![./img/1-1.png](./img/2-1.png)
![./img/1-2.png](./img/2-2.png)

방문한 페이지의 키워드를 LLM을 통해 벡터화하여 기록하고, 이를 기반으로 정확도 높은 방문 기록 검색 기능을 제공합니다. 또한 방문했던 페이지의 제목, 요약문, 주요 키워드를 자동으로 생성하고 미리 정의한 카테고리에 맞게 분류하여 이전에 방문했던 페이지를 빠르게 다시 확인하는데 도와줍니다.

# 설치 방법

### 1. 크롬 개발자 모드 켜기

![./img/3-1.png](./img/3-2.png)

### 2. 압축해제된 확장 프로그램을 로드 (clone한 메인 repo 선택)

![./img/3-2.png](./img/3-2.png)

### 3. 확장 프로그램을 상단에 고정하고 아이콘을 클릭

![상단 고정 스크린샷.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/bfc79d29-8bff-439a-bfd1-720e4c5d6efe/%EC%83%81%EB%8B%A8_%EA%B3%A0%EC%A0%95_%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7.png)

### 4. 로그인하여 시작 (로그인에는 사용자의 구글 계정이 필요합니다)

![로그인.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/b95042c8-6157-4118-898d-cbcc2ffaab0c/%EB%A1%9C%EA%B7%B8%EC%9D%B8.png)

# 주요 기능 및 사용 방법

## 페이지 자동 저장 기능

설정에서 자동 저장 기능을 켜고 끌 수 있습니다.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/982f04a5-13bf-4fb0-b885-b636c70b38a2/image.png)

자동 저장 기능이 켜져 있는 경우, 페이지를 방문할 때마다 데이터가 자동으로 저장됩니다.

<자동 저장 gif>

- 자동 저장에는 약 1초~10초의 지연 시간이 발생합니다.

자동 저장 기능이 꺼져 있는 경우, 저장하고자 하는 페이지에서 우클릭하여 수동으로 저장할 수 있습니다.

<수동 저장 gif>

## 전체 데이터 보기

![그림1.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/9d3c9b74-7ba9-4dbc-9135-a6b8438b821f/%EA%B7%B8%EB%A6%BC1.png)

### 1. 카테고리 분류

- 사용자가 정의한 카테고리 별로 데이터를 확인할 수 있습니다.

### 2. 사용자 정의 필터

- 사용자가 필터를 정의하고 적용 버튼을 누르면 조건을 만족하는 데이터만 추려낼 수 있습니다.
    - 기간 설정 (시작 날짜 ~ 종료 날짜)
    - 도메인 설정 (설정 한 기간 내에 가장 많이 방문한 순으로 10개 중 선택 또는 직접 입력)
    - 정렬 기준 (최근 방문순, 방문 횟수, 체류 시간)
    - 오름차순 또는 내림차순 정렬

![그림2.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/b9bdc9be-01f3-459a-aa51-36a17bd65c0f/%EA%B7%B8%EB%A6%BC2.png)

### 3. 브라우저에서 열기

- 해당 데이터를 추출한 웹페이지의 URL을 브라우저에서 엽니다.

### 4. 카테고리

- 해당 페이지가 분류된 카테고리를 확인할 수 있습니다.

### 5. 삭제

- 해당 데이터를 삭제합니다.

![그림3.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/4928c874-be9a-449b-bce5-11b185364bf0/%EA%B7%B8%EB%A6%BC3.png)

### 6 ~ 9. WHAT에서 기록한 데이터

- 짧은 요약은 해당 페이지의 내용을 짧게 요약한 것으로, 전체 내용을 보려면 해당 데이터 블록을 클릭하면 펼쳐집니다.

![그림4.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/f73d49b2-c5fa-4789-a9cf-da4b2eac085b/%EA%B7%B8%EB%A6%BC4.png)

### 10 ~ 12. 데이터 블록을 펼쳤을 때 보이는 데이터

- 데이터 블록을 펼치면 더 많은 데이터가 보입니다.

### 11. 긴 요약문 보기

- 페이지의 내용을 더 자세하게 나타낼 수 있는 긴 요약문을 표시합니다. 기존 짧은 요약문이 긴 요약문으로 대체되어 표시됩니다.

### 12. 카테고리 수정

- 사용자는 해당 데이터가 자동 배정된 카테고리가 마음에 들지 않으면, 직접 수정할 수 있습니다.

## 검색

WHAT의 검색 탭에서 저장된 페이지를 내용을 검색할 수 있습니다.

![검색1.gif](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/043f2fbf-3273-443b-961a-14e2cfb2f46b/%EA%B2%80%EC%83%891.gif)

‘모든 기간’을 선택하여 방문했던 시간을 설정할 수 있습니다.

![스크린샷 2024-12-19 212308.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/44f64b66-3cd2-4326-9cf3-6b229b2c9e71/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2024-12-19_212308.png)

- ‘직접 선택’을 클릭해 직접 입력할 수도 있습니다.
    
    ![스크린샷 2024-12-19 212332.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/30615f04-b4c9-45a2-8bfb-d516c01d2de3/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2024-12-19_212332.png)
    

‘도메인’을 선택하여 특정 url에 대해서 검색할 수 있습니다.

![스크린샷 2024-12-19 212346.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/2344418c-7f3c-4fa2-a1c9-5a3065ad6aa2/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2024-12-19_212346.png)

- 가장 많이 방문한 url 상위 5개를 보여줍니다.
- ‘직접 입력’을 눌러 도메인을 직접 입력할 수도 있습니다.
    
    ![스크린샷 2024-12-19 212354.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/033ca87e-bc89-45e4-b113-bbbfbc6eb3e7/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2024-12-19_212354.png)
    

‘카테고리’를 선택하여 미리 지정한 카테고리 내에서 검색할 수 있습니다.

![스크린샷 2024-12-19 212407.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/fb583887-d02f-4477-af01-c8c7fa247407/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2024-12-19_212407.png)

## 카테고리 페이지

![그림5.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/26290fa4-a903-439c-8026-b08669cc52ae/%EA%B7%B8%EB%A6%BC5.png)

### 1. 카테고리 목록

- 사용자는 이 페이지에서 카테고리를 수정할 수 있습니다.
- 텍스트 박스를 클릭하여 기존 카테고리의 이름을 수정하거나, X버튼을 눌러 삭제할 수 있습니다.
- 이 카테고리 목록을 기반으로 하여 데이터의 자동 분류가 수행됩니다.

### 2. 카테고리 추가

- 사용자는 원하는 카테고리가 있으면, 텍스트 박스에 추가할 이름을 입력하고, + 버튼 또는 엔터를 눌러 추가할 수 있습니다.
- 추가한 카테고리는 즉시 카테고리 목록에 표시됩니다.

![그림6.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2b742df8-46ab-4276-a950-4cd1e4ed9f85/d0090989-20eb-468a-b934-ab6fcde2fd8a/%EA%B7%B8%EB%A6%BC6.png)

### 3. 수정 사항 적용

- 사용자는 카테고리를 수정하고 수정 사항을 적용해야 합니다.
- 적용 버튼은 수정 사항이 없을 때는 비활성화 되어 있지만, 수정 사항이 있다면 활성화 됩니다
- 적용 버튼을 누를 시 수정 사항이 저장되고, 애플리케이션의 메인 페이지로 이동합니다.

# 라이센스

[LICENSE](./LICENSE)

이 프로젝트는 MIT 라이센스를 따릅니다.

다만, 일부 파일(`domDistiller.js`)의 출처는 [Chromium 프로젝트](https://www.chromium.org/)의 일부입니다. BSD 3-Clause 를 따르며 해당 파일 및 관련 라이센스 조항은 프로젝트 내 [LICENSE](./LICENSE) 파일에 포함되어 있습니다.
