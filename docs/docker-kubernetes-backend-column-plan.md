# Docker 与 Kubernetes 后端开发专栏规划

更新日期：2026-05-12

适用仓库：`E:\awesomeProject\Mak's Blog\Mak-s-Bolg-remote`

## 1. 当前博客技术文档存放位置

当前博客里有两类技术文档，需要区分使用。

### 1.1 正式发布到博客的文章

正式文章放在：

```txt
content/posts/*.mdx
```

这个目录会被站点内容层读取并发布到 `/blog/[slug]/`。

文章文件需要包含 frontmatter：

```mdx
---
slug: "docker-container-networking"
title: "Docker 容器网络：从端口映射到服务互通"
description: "面向后端开发者理解 Docker bridge、端口映射、容器 DNS 与常见网络排查命令。"
date: "2026-05-12"
tag: "Cloud Native"
readTime: "18 min"
top: false
featured: false
---
```

注意：当前内容读取逻辑只读取 `.mdx`，不读取 `.md`。如果要发布文章，请优先使用 `.mdx`。

图片建议放在：

```txt
public/uploads/posts/<slug>/
```

正文中用这种路径引用：

```mdx
![Docker 网络模型](/uploads/posts/docker-container-networking/network-model.png)
```

### 1.2 规划、设计、部署和内部技术文档

规划和内部技术文档放在：

```txt
docs/
```

当前已有文档包括：

- `docs/content-import-guide.md`：文章导入规则、frontmatter、图片路径。
- `docs/tina-cloudflare-production.md`：TinaCMS 与 Cloudflare 生产构建说明。
- `docs/cloudflare-pages-static-export.md`：静态导出与 Cloudflare Pages 说明。
- `docs/cloudflare-workers-static-assets.md`：Workers 静态资源说明。
- `docs/nextjs-blog-performance-optimization.md`：Next.js 性能优化规划。
- `docs/blog-cms/`：CMS 项目说明、技术设计、排期、迁移和发布指南。

本文件属于专栏规划文档，建议先保存在 `docs/`。确认后再拆成正式文章放到 `content/posts/*.mdx`。

## 2. 专栏定位

专栏名称建议：

```txt
后端开发者的 Docker 与 Kubernetes 实战路线
```

备选名称：

- 从后端到云原生：Docker 与 Kubernetes 入门到进阶
- 后端工程师的容器化与 K8s 生存手册
- Docker + K8s：后端服务从本地到集群

### 2.1 目标读者

这个专栏面向两类后端开发者：

- 入门后端：会写接口、会连数据库、会部署简单服务，但对容器、镜像、Pod、Service、Ingress 等概念不系统。
- 进阶后端：已经在业务中接触 Docker 或 Kubernetes，但缺少架构视角、排查方法、资源模型和生产实践经验。

### 2.2 专栏目标

读完后应该能做到：

- 理解 Docker 和 Kubernetes 解决的真实工程问题。
- 能把一个后端服务容器化，并解释镜像、容器、网络、挂载、环境变量的作用。
- 能看懂常见 Kubernetes YAML，并知道每个核心字段的意义。
- 能独立完成 Deployment、Service、Ingress、ConfigMap、Secret 的基本使用。
- 能用高频命令排查服务无法访问、Pod 启动失败、镜像拉取失败、配置不生效等问题。
- 能从软件架构角度理解容器化、服务编排、弹性伸缩、发布回滚、服务发现和配置治理。

### 2.3 写作风格

建议采用固定结构：

```txt
问题场景 -> 架构解释 -> 核心名词 -> 命令实战 -> 参数解释 -> 常见坑 -> 后端开发者检查清单
```

每篇文章都要避免只罗列命令，而是回答三个问题：

- 为什么后端服务需要这个能力？
- 这个能力在 Docker/K8s 里由哪个对象承担？
- 出问题时应该先看哪里？

## 3. 专栏总结构

建议分为 5 个阶段，共 22 篇文章。

```txt
阶段一：容器化基础
阶段二：Docker 后端实战
阶段三：Kubernetes 基础对象
阶段四：Kubernetes 后端部署与排障
阶段五：进阶架构与生产实践
```

## 4. 阶段一：容器化基础

目标：让读者先理解容器到底解决什么问题，而不是直接背命令。

### 01. 后端为什么需要 Docker

建议 slug：

```txt
backend-why-docker
```

核心内容：

- 本地能跑，服务器不能跑的根因。
- 运行环境、系统依赖、配置差异、端口差异。
- Docker 对后端开发流程的改变。
- 容器不是虚拟机，镜像不是压缩包。

重要名词：

- Image
- Container
- Registry
- Dockerfile
- Layer
- Runtime
- Namespace
- Cgroup

高频命令：

```bash
docker version
docker info
docker pull nginx
docker images
docker run nginx
docker ps
docker stop <container>
docker rm <container>
```

重点参数：

- `-d`：后台运行容器。
- `--name`：指定容器名称。
- `-p`：端口映射。
- `-e`：注入环境变量。
- `-v`：挂载数据卷或目录。

### 02. 镜像、容器、仓库的关系

建议 slug：

```txt
docker-image-container-registry
```

核心内容：

- 镜像是只读模板，容器是运行实例。
- 一个镜像可以启动多个容器。
- Registry 是镜像分发中心。
- Tag 不等于版本锁定。
- `latest` 的风险。

高频命令：

```bash
docker pull redis:7
docker tag app:local registry.example.com/team/app:v1.0.0
docker push registry.example.com/team/app:v1.0.0
docker inspect redis:7
docker history redis:7
```

重点参数：

- `repository:tag`：镜像名称和标签。
- `docker inspect`：查看镜像或容器详细元数据。
- `docker history`：查看镜像层历史。

### 03. Dockerfile 如何描述一个后端服务

建议 slug：

```txt
dockerfile-backend-service
```

核心内容：

- Dockerfile 是构建镜像的说明书。
- 后端服务常见构建流程：复制代码、安装依赖、编译、运行。
- 多阶段构建减少镜像体积。
- 构建阶段和运行阶段要分离。

示例 Dockerfile：

```dockerfile
FROM golang:1.22 AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o app ./cmd/server

FROM alpine:3.20
WORKDIR /app
COPY --from=builder /src/app ./app
EXPOSE 8080
ENTRYPOINT ["./app"]
```

重要指令：

- `FROM`：指定基础镜像。
- `WORKDIR`：设置工作目录。
- `COPY`：复制文件到镜像。
- `RUN`：构建阶段执行命令。
- `EXPOSE`：声明服务端口。
- `CMD`：默认启动命令。
- `ENTRYPOINT`：固定入口命令。

高频命令：

```bash
docker build -t my-api:local .
docker run --rm -p 8080:8080 my-api:local
docker logs -f <container>
```

### 04. 容器网络：端口映射、容器互通和 DNS

建议 slug：

```txt
docker-container-networking
```

核心内容：

- 容器内部端口和宿主机端口不是一回事。
- `127.0.0.1` 在容器内指向容器自己。
- bridge 网络如何让容器互通。
- Docker Compose 中服务名可以作为 DNS 名称。

高频命令：

```bash
docker network ls
docker network inspect bridge
docker network create app-net
docker run --network app-net --name redis redis:7
docker run --network app-net --name api my-api:local
```

重点参数：

- `-p 8080:8080`：宿主机端口:容器端口。
- `--network`：指定容器加入的网络。
- `--add-host`：添加自定义 hosts 映射。

常见坑：

- 容器内访问宿主机服务不能直接用 `localhost`。
- 服务监听 `127.0.0.1` 时，容器外可能无法访问。
- 防火墙和安全组也会影响端口暴露。

### 05. 数据卷与配置：数据库文件、日志和配置怎么处理

建议 slug：

```txt
docker-volume-config
```

核心内容：

- 容器文件系统默认是临时的。
- 数据库、上传文件、日志不应该只放在容器可写层。
- 配置应该通过环境变量、挂载文件或配置中心注入。

高频命令：

```bash
docker volume ls
docker volume create mysql-data
docker run -v mysql-data:/var/lib/mysql mysql:8
docker run -v ./config.yaml:/app/config.yaml my-api:local
```

重点参数：

- `-v volume:/path`：挂载 Docker volume。
- `-v /host/path:/container/path`：挂载宿主机目录或文件。
- `--mount`：更明确的挂载语法。

## 5. 阶段二：Docker 后端实战

目标：把后端服务、数据库、缓存和消息队列组织起来，形成完整本地开发环境。

### 06. Docker Compose 管理后端开发环境

建议 slug：

```txt
docker-compose-backend-dev
```

核心内容：

- Compose 解决多容器编排问题。
- 一个后端服务通常依赖数据库、缓存、消息队列。
- `depends_on` 只保证启动顺序，不保证服务可用。

示例：

```yaml
services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      DB_HOST: mysql
      REDIS_ADDR: redis:6379
    depends_on:
      - mysql
      - redis

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: app
    volumes:
      - mysql-data:/var/lib/mysql

  redis:
    image: redis:7

volumes:
  mysql-data:
```

高频命令：

```bash
docker compose up -d
docker compose ps
docker compose logs -f api
docker compose exec mysql mysql -uroot -proot
docker compose down
docker compose down -v
```

重点参数：

- `up -d`：后台启动服务组。
- `logs -f`：持续查看日志。
- `exec`：进入正在运行的服务容器执行命令。
- `down -v`：停止并删除 volume，慎用。

### 07. 后端服务镜像优化：体积、缓存、安全

建议 slug：

```txt
docker-image-optimization-backend
```

核心内容：

- 镜像越小，拉取越快，攻击面越小。
- 依赖安装层要利用缓存。
- 不要把 `.env`、密钥、测试数据打进镜像。
- 使用非 root 用户运行服务。

高频命令：

```bash
docker build --no-cache -t my-api:test .
docker image prune
docker system df
docker scan my-api:local
```

重点参数：

- `--no-cache`：忽略构建缓存。
- `.dockerignore`：排除不需要进入构建上下文的文件。
- `USER`：指定运行用户。

### 08. 容器日志与健康检查

建议 slug：

```txt
docker-logs-healthcheck
```

核心内容：

- 容器化后，日志应该输出到 stdout/stderr。
- 后端服务要提供健康检查接口。
- 健康检查不是业务监控，但能帮助编排系统判断是否可用。

高频命令：

```bash
docker logs <container>
docker logs -f --tail 100 <container>
docker inspect --format='{{json .State.Health}}' <container>
```

Dockerfile 示例：

```dockerfile
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1
```

重点参数：

- `--tail`：只看最后 N 行日志。
- `--since`：查看某个时间之后的日志。
- `--interval`：健康检查间隔。
- `--timeout`：单次健康检查超时时间。
- `--retries`：连续失败多少次判定 unhealthy。

## 6. 阶段三：Kubernetes 基础对象

目标：从 Docker 的单机容器，过渡到 Kubernetes 的集群编排。

### 09. Kubernetes 到底在编排什么

建议 slug：

```txt
kubernetes-what-does-it-orchestrate
```

核心内容：

- Docker 解决单机容器运行问题。
- Kubernetes 解决多机器、多副本、服务发现、滚动发布、自愈和资源调度问题。
- Kubernetes 不是只负责启动容器，而是维护期望状态。

重要名词：

- Cluster
- Node
- Pod
- Deployment
- ReplicaSet
- Service
- Ingress
- Namespace
- ConfigMap
- Secret
- Volume

架构讲解：

```txt
用户请求
  -> Ingress / LoadBalancer
  -> Service
  -> Pod
  -> Container
  -> 后端进程
```

控制面：

- kube-apiserver：统一 API 入口。
- etcd：集群状态存储。
- scheduler：决定 Pod 调度到哪个节点。
- controller-manager：持续让真实状态靠近期望状态。

节点侧：

- kubelet：节点代理，负责 Pod 生命周期。
- kube-proxy：服务转发规则。
- container runtime：真正运行容器。

### 10. Pod：Kubernetes 中最小调度单位

建议 slug：

```txt
kubernetes-pod-for-backend
```

核心内容：

- Pod 不是容器，但通常一个 Pod 里运行一个主容器。
- Pod 共享网络命名空间。
- 同一个 Pod 内多个容器可以通过 `localhost` 通信。
- Pod 是短生命周期对象，不应该直接管理生产服务。

高频命令：

```bash
kubectl get pods
kubectl get pod <pod> -o wide
kubectl describe pod <pod>
kubectl logs <pod>
kubectl logs -f <pod>
kubectl exec -it <pod> -- sh
kubectl delete pod <pod>
```

重点参数：

- `-o wide`：显示节点 IP、Pod IP、调度节点等更多信息。
- `describe`：查看事件、调度、镜像拉取、探针失败等细节。
- `logs -f`：持续查看日志。
- `exec -it`：进入容器交互式执行命令。

### 11. Deployment：后端服务的副本与滚动发布

建议 slug：

```txt
kubernetes-deployment-backend-service
```

核心内容：

- Deployment 管理 ReplicaSet，ReplicaSet 管理 Pod。
- 后端服务通常不直接创建 Pod，而是创建 Deployment。
- Deployment 提供副本数、滚动更新、回滚能力。

示例：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: registry.example.com/team/api:v1.0.0
          ports:
            - containerPort: 8080
```

高频命令：

```bash
kubectl apply -f deployment.yaml
kubectl get deploy
kubectl rollout status deploy/api
kubectl rollout history deploy/api
kubectl rollout undo deploy/api
kubectl scale deploy/api --replicas=5
kubectl set image deploy/api api=registry.example.com/team/api:v1.0.1
```

重点字段：

- `replicas`：期望副本数。
- `selector.matchLabels`：Deployment 用来选择 Pod 的标签。
- `template.metadata.labels`：Pod 模板标签，必须和 selector 匹配。
- `containers.image`：容器镜像。
- `containerPort`：容器内部服务端口声明。

### 12. Service：稳定访问后端服务

建议 slug：

```txt
kubernetes-service-backend-networking
```

核心内容：

- Pod IP 会变化，Service 提供稳定访问入口。
- Service 通过 label selector 找到后端 Pod。
- ClusterIP、NodePort、LoadBalancer 的使用场景。

示例：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  type: ClusterIP
  selector:
    app: api
  ports:
    - name: http
      port: 80
      targetPort: 8080
```

高频命令：

```bash
kubectl get svc
kubectl describe svc api
kubectl get endpoints api
kubectl port-forward svc/api 8080:80
```

重点字段：

- `port`：Service 暴露的端口。
- `targetPort`：Pod 容器实际监听端口。
- `selector`：选择后端 Pod。
- `type`：服务暴露方式。

### 13. Ingress：HTTP 入口、域名和路由

建议 slug：

```txt
kubernetes-ingress-backend-routing
```

核心内容：

- Service 解决集群内部访问，Ingress 解决 HTTP/HTTPS 入口。
- Ingress Controller 才是真正处理流量的组件。
- 域名、路径、TLS 证书和后端 Service 的关系。

示例：

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api
spec:
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api
                port:
                  number: 80
```

高频命令：

```bash
kubectl get ingress
kubectl describe ingress api
kubectl get ingressclass
```

重点字段：

- `host`：域名。
- `path`：路由路径。
- `pathType`：路径匹配方式。
- `backend.service.name`：转发到哪个 Service。
- `backend.service.port.number`：转发到 Service 的哪个端口。

### 14. ConfigMap 与 Secret：配置和敏感信息

建议 slug：

```txt
kubernetes-configmap-secret-backend
```

核心内容：

- 镜像应该保持环境无关。
- 普通配置放 ConfigMap。
- 密码、Token、证书等敏感信息放 Secret。
- Secret 默认不是强安全保险箱，需要结合 RBAC、加密存储和权限控制。

高频命令：

```bash
kubectl create configmap api-config --from-literal=APP_ENV=prod
kubectl create secret generic api-secret --from-literal=DB_PASSWORD=secret
kubectl get configmap
kubectl get secret
kubectl describe configmap api-config
```

环境变量注入：

```yaml
env:
  - name: APP_ENV
    valueFrom:
      configMapKeyRef:
        name: api-config
        key: APP_ENV
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: api-secret
        key: DB_PASSWORD
```

重点字段：

- `configMapKeyRef`：从 ConfigMap 中读取某个 key。
- `secretKeyRef`：从 Secret 中读取某个 key。
- `envFrom`：批量注入配置。

## 7. 阶段四：Kubernetes 后端部署与排障

目标：让读者具备日常工作中最常用的部署、观察和排查能力。

### 15. 后端服务部署完整链路

建议 slug：

```txt
kubernetes-backend-deploy-chain
```

核心内容：

从代码到线上请求的完整路径：

```txt
代码提交
  -> 构建镜像
  -> 推送镜像仓库
  -> 更新 Deployment
  -> Pod 拉取镜像
  -> Service 选择 Pod
  -> Ingress 接入流量
  -> 用户请求命中服务
```

日常检查命令：

```bash
kubectl get deploy,rs,pod,svc,ingress
kubectl rollout status deploy/api
kubectl get pod -l app=api -o wide
kubectl logs -f deploy/api
kubectl describe pod <pod>
```

### 16. Probe：让 Kubernetes 判断服务是否健康

建议 slug：

```txt
kubernetes-probes-backend-health
```

核心内容：

- livenessProbe：服务是否还活着，失败后重启容器。
- readinessProbe：服务是否能接流量，失败后从 Service endpoints 移除。
- startupProbe：慢启动服务的保护机制。

示例：

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```

重点参数：

- `initialDelaySeconds`：容器启动后延迟多久开始探测。
- `periodSeconds`：探测周期。
- `timeoutSeconds`：探测超时时间。
- `failureThreshold`：连续失败多少次判定失败。
- `successThreshold`：连续成功多少次判定成功。

### 17. 资源限制：CPU、内存与 OOM 排查

建议 slug：

```txt
kubernetes-resource-requests-limits
```

核心内容：

- requests 影响调度。
- limits 影响容器可使用资源上限。
- CPU 可压缩，内存不可压缩。
- OOMKilled 是后端服务最常见问题之一。

示例：

```yaml
resources:
  requests:
    cpu: "200m"
    memory: "256Mi"
  limits:
    cpu: "1"
    memory: "512Mi"
```

高频命令：

```bash
kubectl top pod
kubectl top node
kubectl describe pod <pod>
kubectl get pod <pod> -o yaml
```

重点字段：

- `cpu: "200m"`：0.2 个 CPU 核。
- `memory: "256Mi"`：256 MiB 内存。
- `requests`：最小资源承诺。
- `limits`：最大资源限制。

### 18. 常见故障排查：Pod 为什么起不来

建议 slug：

```txt
kubernetes-pod-troubleshooting
```

核心内容：

常见状态：

- `Pending`：调度失败或资源不足。
- `ImagePullBackOff`：镜像拉取失败。
- `CrashLoopBackOff`：容器反复崩溃。
- `CreateContainerConfigError`：配置引用错误。
- `OOMKilled`：内存超限被杀。
- `Running` 但不通：服务监听、Service selector、端口或 Ingress 问题。

排查顺序：

```bash
kubectl get pod -o wide
kubectl describe pod <pod>
kubectl logs <pod>
kubectl logs <pod> --previous
kubectl get events --sort-by=.lastTimestamp
kubectl get svc,endpoints
```

后端开发者判断口诀：

```txt
先看状态，再看事件；
先看容器日志，再看探针；
先看 Pod 是否 ready，再看 Service 是否选中；
先看集群内访问，再看 Ingress 外部入口。
```

### 19. 日志、事件与临时调试容器

建议 slug：

```txt
kubernetes-debug-logs-events
```

核心内容：

- 日志看应用输出。
- Events 看 Kubernetes 层面的调度、拉镜像、探针、挂载问题。
- 临时调试容器适合网络排查和工具补充。

高频命令：

```bash
kubectl logs deploy/api
kubectl logs -f deploy/api --tail=200
kubectl logs <pod> -c <container>
kubectl get events --sort-by=.lastTimestamp
kubectl debug -it <pod> --image=busybox --target=<container>
kubectl run debug --rm -it --image=busybox -- sh
```

重点参数：

- `-c`：指定 Pod 内的某个容器。
- `--previous`：查看上一次崩溃容器的日志。
- `--tail`：查看最后 N 行。
- `--target`：指定调试目标容器。

## 8. 阶段五：进阶架构与生产实践

目标：从“会部署”升级到“理解生产架构与稳定性设计”。

### 20. 发布策略：滚动发布、蓝绿发布与灰度发布

建议 slug：

```txt
kubernetes-release-strategies
```

核心内容：

- RollingUpdate：默认滚动更新。
- Blue/Green：两套环境切换流量。
- Canary：按比例或规则逐步放量。
- 发布不是更新镜像这么简单，还包括监控、回滚、兼容性和数据变更。

高频命令：

```bash
kubectl rollout status deploy/api
kubectl rollout history deploy/api
kubectl rollout undo deploy/api
kubectl set image deploy/api api=registry.example.com/team/api:v1.0.2
```

重点字段：

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

- `maxSurge`：更新过程中最多额外创建多少 Pod。
- `maxUnavailable`：更新过程中最多允许多少 Pod 不可用。

### 21. 服务发现、负载均衡与后端调用链路

建议 slug：

```txt
kubernetes-service-discovery-backend
```

核心内容：

- 服务名 DNS：`service.namespace.svc.cluster.local`。
- Service 不是传统进程，而是一组转发规则和虚拟入口。
- 后端服务调用时要考虑超时、重试、熔断和连接池。

高频命令：

```bash
kubectl get svc -A
kubectl get endpoints api
kubectl exec -it <pod> -- nslookup api
kubectl exec -it <pod> -- wget -qO- http://api.default.svc.cluster.local
```

### 22. 从单体后端到云原生架构

建议 slug：

```txt
backend-cloud-native-architecture
```

核心内容：

- 单体服务如何容器化。
- 多服务拆分后，配置、日志、监控、链路追踪、发布和回滚如何变化。
- Kubernetes 负责基础编排，但不替代业务架构设计。

架构模块：

- API Gateway / Ingress
- Backend Service
- Worker
- Database
- Cache
- Message Queue
- Object Storage
- Observability
- CI/CD

建议配图：

```txt
用户
  -> CDN / WAF
  -> Ingress / Gateway
  -> 后端 API
  -> Redis / MySQL / Kafka / Object Storage
  -> Metrics / Logs / Traces
```

## 9. 核心名词表

### Docker 名词

| 名词 | 解释 | 后端开发者关注点 |
| --- | --- | --- |
| Image | 镜像，容器运行模板 | 是否包含正确运行时、依赖和启动命令 |
| Container | 容器，镜像运行实例 | 服务进程是否正常、端口是否监听 |
| Dockerfile | 镜像构建说明 | 如何构建后端服务镜像 |
| Layer | 镜像层 | 构建缓存、镜像体积、依赖复用 |
| Registry | 镜像仓库 | 镜像推送、拉取、权限和版本管理 |
| Volume | 数据卷 | 数据持久化、日志、上传文件 |
| Network | 容器网络 | 容器互通、端口映射、DNS |
| Compose | 多容器本地编排 | 本地启动 API、DB、Redis、MQ |

### Kubernetes 名词

| 名词 | 解释 | 后端开发者关注点 |
| --- | --- | --- |
| Cluster | 集群 | 服务运行的整体环境 |
| Node | 工作节点 | Pod 被调度到哪台机器 |
| Pod | 最小调度单位 | 应用容器实际运行位置 |
| Deployment | 无状态服务管理对象 | 副本数、发布、回滚 |
| ReplicaSet | 副本控制对象 | 通常由 Deployment 管理 |
| Service | 稳定访问入口 | Pod IP 变化后仍能访问服务 |
| Ingress | HTTP/HTTPS 入口规则 | 域名、路径、TLS、外部流量 |
| ConfigMap | 普通配置 | 非敏感配置注入 |
| Secret | 敏感配置 | 密码、Token、证书 |
| Namespace | 资源隔离空间 | 环境隔离、权限隔离 |
| Probe | 健康检查 | 是否重启、是否接流量 |
| Requests | 资源请求 | 调度依据 |
| Limits | 资源上限 | CPU/内存限制 |
| Events | 集群事件 | 排查调度、拉镜像、挂载、探针问题 |

## 10. 高频命令速查

### Docker 高频命令

```bash
# 查看环境
docker version
docker info

# 镜像
docker pull <image>
docker images
docker build -t <name>:<tag> .
docker tag <source> <target>
docker push <image>
docker rmi <image>

# 容器
docker run -d --name api -p 8080:8080 <image>
docker ps
docker ps -a
docker logs -f api
docker exec -it api sh
docker stop api
docker rm api

# 网络
docker network ls
docker network inspect <network>
docker network create <network>

# 数据卷
docker volume ls
docker volume create <volume>
docker volume inspect <volume>

# 清理
docker image prune
docker container prune
docker system df
```

### Docker 常用参数

| 参数 | 含义 | 示例 |
| --- | --- | --- |
| `-d` | 后台运行 | `docker run -d nginx` |
| `--name` | 指定容器名 | `--name api` |
| `-p` | 端口映射 | `-p 8080:80` |
| `-e` | 环境变量 | `-e APP_ENV=prod` |
| `-v` | 挂载目录或卷 | `-v data:/var/lib/mysql` |
| `--rm` | 容器退出后自动删除 | `docker run --rm busybox` |
| `--network` | 指定网络 | `--network app-net` |
| `--restart` | 重启策略 | `--restart unless-stopped` |

### kubectl 高频命令

```bash
# 上下文与命名空间
kubectl config get-contexts
kubectl config use-context <context>
kubectl get ns
kubectl config set-context --current --namespace=<namespace>

# 查看资源
kubectl get pod
kubectl get pod -o wide
kubectl get deploy,rs,pod,svc,ingress
kubectl get all
kubectl describe pod <pod>

# 应用配置
kubectl apply -f app.yaml
kubectl delete -f app.yaml
kubectl diff -f app.yaml

# 日志和进入容器
kubectl logs <pod>
kubectl logs -f deploy/api
kubectl logs <pod> -c <container>
kubectl logs <pod> --previous
kubectl exec -it <pod> -- sh

# 发布与回滚
kubectl rollout status deploy/api
kubectl rollout history deploy/api
kubectl rollout undo deploy/api
kubectl set image deploy/api api=<image>
kubectl scale deploy/api --replicas=3

# 网络排查
kubectl get svc
kubectl get endpoints
kubectl port-forward svc/api 8080:80

# 资源与事件
kubectl top pod
kubectl top node
kubectl get events --sort-by=.lastTimestamp
```

### kubectl 常用参数

| 参数 | 含义 | 示例 |
| --- | --- | --- |
| `-n` | 指定命名空间 | `kubectl get pod -n prod` |
| `-A` | 所有命名空间 | `kubectl get pod -A` |
| `-o wide` | 显示更多字段 | `kubectl get pod -o wide` |
| `-o yaml` | 输出 YAML | `kubectl get pod api -o yaml` |
| `-l` | 按标签筛选 | `kubectl get pod -l app=api` |
| `--selector` | 按标签筛选 | `--selector app=api` |
| `--watch` | 持续观察变化 | `kubectl get pod --watch` |
| `--tail` | 日志最后 N 行 | `kubectl logs api --tail=100` |
| `--previous` | 上一次容器日志 | `kubectl logs api --previous` |
| `--context` | 指定集群上下文 | `kubectl get pod --context prod` |

## 11. 推荐发布顺序

第一批先发布 6 篇，建立完整阅读入口：

1. `backend-why-docker`
2. `dockerfile-backend-service`
3. `docker-compose-backend-dev`
4. `kubernetes-what-does-it-orchestrate`
5. `kubernetes-deployment-backend-service`
6. `kubernetes-pod-troubleshooting`

第二批补齐 Docker 基础和 K8s 核心对象：

1. `docker-image-container-registry`
2. `docker-container-networking`
3. `docker-volume-config`
4. `kubernetes-pod-for-backend`
5. `kubernetes-service-backend-networking`
6. `kubernetes-configmap-secret-backend`

第三批进入进阶和生产实践：

1. `kubernetes-ingress-backend-routing`
2. `kubernetes-probes-backend-health`
3. `kubernetes-resource-requests-limits`
4. `kubernetes-release-strategies`
5. `kubernetes-service-discovery-backend`
6. `backend-cloud-native-architecture`

## 12. 首页与专题入口建议

这个专栏适合做成博客中的一个固定专题入口。

建议专题名称：

```txt
Docker / Kubernetes 后端实战
```

建议专题说明：

```txt
从后端服务容器化开始，逐步理解 Docker 镜像、容器网络、Compose 本地环境、Kubernetes Pod、Deployment、Service、Ingress、配置管理、健康检查、发布回滚和日常排障。
```

建议标签：

```txt
Cloud Native
Docker
Kubernetes
Backend
DevOps
```

建议在首页增加入口：

```txt
新手路径：Dockerfile -> Compose -> Deployment -> Service -> Troubleshooting
进阶路径：Probe -> Resource -> Ingress -> Rollout -> Architecture
```

## 13. 每篇文章模板

后续拆成正式文章时，可以复用这个模板：

```mdx
---
slug: "<slug>"
title: "<标题>"
description: "<一句话说明这篇文章解决什么问题>"
date: "2026-05-12"
tag: "Cloud Native"
readTime: "18 min"
top: false
featured: false
---

## 这篇解决什么问题

说明后端开发者在真实工作中会遇到的场景。

## 架构位置

解释这个概念在 Docker/Kubernetes 架构中的位置。

## 核心名词

列出 5 到 8 个必须理解的名词。

## 最小可运行示例

给出可直接复制运行的命令或 YAML。

## 高频命令

列出日常最常用命令，并解释输出怎么看。

## 参数意义

解释关键参数，不只翻译单词。

## 常见问题

列出最容易踩坑的点和排查顺序。

## 后端开发者检查清单

用 checklist 收尾，方便读者复盘。
```

## 14. 专栏完成标准

这个专栏完成后，应该满足：

- 每篇文章都有真实后端场景，不是命令手册搬运。
- 每篇文章都有至少一段架构解释。
- 每篇文章都有高频命令和参数说明。
- K8s YAML 字段要解释“为什么需要”，而不是只给配置。
- 入门文章能让读者跑起来，进阶文章能让读者排查问题。
- 专栏整体能串成一条完整路径：本地容器化 -> 多服务环境 -> 集群部署 -> 流量入口 -> 健康检查 -> 排障 -> 发布回滚 -> 架构演进。

