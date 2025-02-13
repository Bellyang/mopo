# 命令

输入**mopo -h**来显示所有的命令：

```bash
Usage: mopo <command> [options]

Options:
  -v, --version      output the version number
  -h, --help         display help for command

Commands:
  init <repo-name>   Init a new monorepo
  create <app-name>  Create a new project
  prepare [options]  Init hooks
  serve [options]    Start a new project
  build [options]    Build projects
  commit [options]   Git add and commit changes
  release [options]  Update changelogs, bump the version, and tag the commit

```

## 1. 创建仓库

需要创建仓库，只需输入：

```bash
mopo init repoName
```

::: details
![Init repo](/init.gif)
:::

使用**init**命令会在当前目录或者按照所给出的**repoName**作为名称创建一个**Monorepo**仓库。

默认的目录结构为:

```
repoName/
├── packages/            # Default workspace
├── .gitignore           # Git exclusion rules
├── package.json         # Workspace config (npm/yarn)
└── pnpm-workspace.yaml  # PNPM workspace configuration
```

当然，不使用此目录结构也是可以的，你完全可以按照你自己的需要创建仓库。但是注意在**git**初始化后，有.git目录时执行:

```bash
mopo prepare
```

来初始化git hook，此命令会注册 **commit-msg** 和 **prepare-commit-msg** hook，用来拦截本地的git提交，校验git commit的格式。

## 2. 创建项目

使用

```bash
mopo create projectName
```
来创建项目。

::: details
![Create project](/create.gif)
:::

例如使用**mopo create @yourOrg/pkgName**将会以**pkgName**作为路径在**packages**目录下创建新项目。而<em>@yourOrg/pkgName</em>会作为**package.json**中的**name**属性。

```json [package.json]
{
  "name": "@yourOrg/pkgName", // [!code focus]
  "version": "0.0.1",
}
```

此外，**create**命令执行过程中你将可以选择Vue 2/3或者React作为基础框架，选择pnpm，npm，或者yarn作为包管理工具。

生成的目录结构示例如下：

::: code-group
``` [Vue 2/3]
projectName/
├── assets       # 资源目录，存放图片，样式等
├── components   # 组件目录
├── config       # 项目设置
├── views        # 项目视图
├── public       # 静态资源
├── router       # 路由
├── store        # 状态管理
├── types        # 类型声明
├── utils        # 工具方法
├── main.ts      # 项目主入口
├── index.html   # html页面
└── package.json
```
``` [React]
projectName/
├── api           # 接口
├── app.tsx       # app入口
├── assets        # 资源目录，存放图片，样式等
├── components    # 组件目录
├── config        # 项目设置
├── features      # 特性目录
├── hooks         # 钩子
├── index.html    # html页面
├── lib         
├── main.ts       # 项目主入口
├── package.json  
├── router        # 路由
├── services      # 服务
├── store         # 状态管理
├── types         # 类型声明
├── utils         # 工具方法
└── views         # 项目视图
```
:::

当然，此项目结构也并非固定，只有**main.ts**和**index.html**作为主入口是必须在根目录的。

> 参考：Vite中必须将index.html放在根目录 [index.html and Project Root](https://vite.dev/guide/#index-html-and-project-root)

::: tip
后续会考虑将**create-vue**或者**create-react-app**，甚至url作为参数纳入template的生成
:::

## 3. 启动本地服务

需要启动本地的开发环境，只需输入

```bash
mopo serve -n projectName
# 或者
mopo serve -n @yourOrg/pkgName
# 或者根据git diff的结果来对代码有变动的项目开启服务
mopo serve -d
# 或者 启动所有项目
mopo serve -a
```

::: danger ⚠️ 注意
基于性能考虑，慎用-a命令
:::

由于项目彼此间可能存在依赖关系，一个项目的变更可能会需要更新另一个项目，所以**serve**命令的<em>-n</em>参数接收数组作为参数，按照先后顺序开启项目。

默认使用webpack作为打包工具，可以使用:

```bash
mopo serve -n projectName -b vite
```
选择vite作为打包工具。

另外，可以使用-an

```bash
mopo serve -n projectName -an
```

查看包分析工具，或者-s

```bash
mopo serve -n projectName -s
```

查看打包速度。

详细的命令如下:
::: details
``` bash
Usage: mopo serve [options]

Start a new project

Options:
  -a --all                Serve all (default: false)
  -an --analyzer          Analyzer bundle (default: false)
  -s --speed              Build speed measure (default: false)
  -d --diff               Serve based on the results of "git diff" (default: false)
  -n --names [names...]   One or more project names be served in order. (default: [])
  -b --bundler [bundler]  Choose a bundling tool, default is webpack (default: "webpack")
  -h, --help              display help for command
```
:::

## 4. 构建项目

构建项目，只需使用:

```bash
mopo build -n projectName
# 或者
mopo build -n @yourOrg/pkgName
# 或者根据git diff的结果来对代码有变动的项目进行构建
mopo build -d
# 或者 构建所有项目
mopo build -a
```

::: danger ⚠️ 注意
基于性能考虑，慎用-a命令
:::

## 5. 提交

**Mopo**遵循**Conventional Commits**的原则，输入：

```bash
mopo commit -n projectName
# 或者
mopo commit -n @yourOrg/pkgName
# 或者根据git diff的结果来对代码有变动的项目进行构建
mopo commit -d
# 或者 构建所有项目
mopo commit -a
```

进行提交，这里会根据输入参数来**git add**对应项目的变动，然后弹出互动对话框来收集提交信息。

::: details
![Commit](/commit.gif)
:::

在整个提交过程中，命令会先通过参数弹出多选框选择需要**git add**的文件范围，可自定义选中或者反选来添加提交，然后根据需要提交的文件来执行**Lint-staged**命令执行提交文件的格式检查，通过后弹出选项框完善提交信息，这里需要满足：
```bash
type(scope): subject
# 或者
type(scope, scope): subject
# 或者
type(scope, scope)!: subject
# 又或者
Merge words
```
的提交格式。

当然，手动提交也是可以的，只要满足上述格式即可，**Mopo**会在提交时利用**git hook**校验，例如：

```bash
git commit -m "feat(@yourOrg/pkgName1, @yourOrg/pkgName2): subject with many words"

```
::: info [完整流程]
git add -> lint-staged check -> cz-git -> git push
:::
## 6. 发布

发布主要使用[release-it](https://github.com/release-it/release-it)进行，

执行：

```bash
mopo release -n projectName
# 或者
mopo release -n @yourOrg/pkgName
# 或者根据git diff的结果来对代码有变动的项目进行发布
mopo release -d
# 或者 发布所有项目
mopo release -a
```

这里的-a和上述说的-a有所不同，这里发布所有指的是所有项目共用一个版本号，使用的是[release-it-plugins/workspaces](https://github.com/release-it-plugins/workspaces)，作为发布工具，而其他发布都会根据入参，顺序发布，更新版本号及其依赖。

发布的部分使用了release-it的两个插件:

[release-it-plugins/workspaces](https://github.com/release-it-plugins/workspaces)
和
[release-it/conventional-changelog](https://github.com/release-it/conventional-changelog)

::: info [顺序发布的完整流程]
项目a

升级版本号 -> 生成CHANGELOG

项目b

升级版本号 -> 生成CHANGELOG

选中项目（项目a,b）

升级依赖的版本号 -> Commit -> Tag -> Push
:::

流程根据实际配置文件不同会有差异。

