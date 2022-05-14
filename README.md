# Examflix

[`넷플릭스(Netflix)`](https://www.netflix.com) 주제로 비지니스 컴퓨팅 기술 팀과제 수행

## SetUp

첫번째로, 관련 라이브러리 설치:

```bash
npm i
```

### **PlanetScale** 회원가입

PlanetScale SignUp Link => [https://auth.planetscale.com/sign-up](https://auth.planetscale.com/sign-up)

### **PlanetScale CLI(`pscale`)** 설치:

#### macOS

`pscale` is available via a Homebrew Tap, and as downloadable binary from the [releases](https://github.com/planetscale/cli/releases/latest) page:

```
brew install planetscale/tap/pscale
```

Optional: `pscale` requires the MySQL Client for certain commands. You can install it by running:

```
brew install mysql-client
```

To upgrade to the latest version:

```
brew upgrade pscale
```

#### Linux

`pscale` is available as downloadable binaries from the [releases](https://github.com/planetscale/cli/releases/latest) page. Download the .deb or .rpm from the [releases](https://github.com/planetscale/cli/releases/latest) page and install with `sudo dpkg -i` and `sudo rpm -i` respectively.

#### Windows

`pscale` is available via [scoop](https://scoop.sh/), and as a downloadable binary from the [releases](https://github.com/planetscale/cli/releases/latest) page:

```
scoop bucket add pscale https://github.com/planetscale/scoop-bucket.git
scoop install pscale mysql
```

### `pscale` 설치 유무 확인:

```
pscale
=>
pscale is a CLI library for communicating with PlanetScale's API.
Usage:
  pscale [command]
...
...
```

### `pscale` 로그인

```
pscale auth login
```

로그인 사이트에서 **Confirm Code** 버튼 클릭

### **PlanetScale** 데이타베이스 생성

```
pscale database create mbox --region ap-northeast
```

### TMDB 데이터 **ETL**(**E**xtract => **T**ransform => **L**oad) 실행

```
npx prisma db seed
```

## Getting Started

### **PlanetScale** 데이타베이스 연결

```
pscale connect mbox
=>
Tried address <LOCALHOST_URL>, but it's already in use. Picking up a random port ...
Secure connection to database mbox and branch main is established!.
Local address to connect your application: <LOCALHOST_URL> (press ctrl-c to quit)
```

### .env 파일 생성 및 작성

```
DATABASE_URL="mysql://<LOCALHOST_URL>/examflix"
API_KEY=<YOUR_TMDB_API_KEY>
```

### 서버 실행

```
npm run dev
```
