# Tóm tắt phiên chat

## 1. Agent AI không phải “thực thể tự làm mọi thứ”

Agent hiện tại chủ yếu gồm 3 lớp:

```text
LLM (brain)
+ Tools (capabilities)
+ Workflow (control)
```

- **LLM**: hiểu ngôn ngữ, suy luận, lập kế hoạch.
- **Tools**: hành động thật (query DB, gọi API, RAG, create order...).
- **Workflow**: điều phối logic (route, retry, fallback, guardrails).

---

## 2. Tool không phải do agent tự sinh

Tool gần như luôn do dev viết trước:

```text
Dev viết tool → đăng ký cho agent → agent chọn dùng
```

Ví dụ:

```ts
searchProducts()
getProductDetail()
retrieveDocs()
```

Agent chỉ quyết định:

- gọi tool nào
- khi nào gọi
- truyền params gì

Nó không tự tạo capability mới nếu dev không cấp.

---

## 3. Không có tool thì agent chỉ “biết”, không “làm”

Ví dụ:

User:

> đặt vé máy bay

Không có tool:

✅ tư vấn được  
❌ đặt thật được

Muốn làm thật cần:

- booking API
- payment API
- auth
- workflow

Tức là capability ngoài LLM.

---

## 4. Có 3 kiểu agent phổ biến

### A. Fully autonomous

```text
LLM tự chọn tool + tự loop
```

Ưu:

- linh hoạt

Nhược:

- khó kiểm soát
- dễ hallucinate
- dễ loop
- khó debug

---

### B. Workflow-driven (kiểu đang làm)

```text
detectIntent
→ extractParams
→ routeIntent
→ productSearch
→ rerank
→ synthesize
```

Dev kiểm soát flow.

Phù hợp:

- ecommerce
- fintech
- legal
- O&M

Ưu:

- deterministic
- dễ audit
- dễ debug
- ổn định production

---

### C. Hybrid

Outer flow deterministic, inner sub-agent autonomous khi cần.

Ví dụ:

```text
MainGraph
 ├─ Product flow
 ├─ Docs flow
 └─ Complex reasoning → ReAct sub-agent
```

---

## 5. Vai trò thật của LLM trong Agent

LLM chủ yếu làm:

- hiểu input
- detect intent
- extract params
- planning
- reasoning
- synthesize response

Ví dụ:

```text
User: tìm giày chạy bộ dưới 2 triệu
```

LLM có thể suy ra:

```json
{
  "intent": "PRODUCT_SEARCH",
  "params": {
    "category": "running shoes",
    "maxPrice": 2000000
  }
}
```

Nhưng việc query DB vẫn là tool của dev.

---

## 6. Vai trò của Dev

Dev quyết định:

### State

```ts
{
  input,
  intent,
  params,
  products,
  docs,
  answer
}
```

---

### Routing

```ts
if (intent === "PRODUCT_SEARCH")
```

hoặc:

```ts
.addConditionalEdges(...)
```

---

### Tool implementation

```ts
async function productSearch() {
  return db.query(...)
}
```

---

### Business rules

```ts
if stock === 0 -> exclude
if role !== admin -> deny
if price > budget -> filter
```

Những thứ này không nên giao cho LLM.

---

## 7. Vì sao PR “agent mạnh” nghe rất ghê

Marketing thường đánh đồng:

```text
Biết làm
=
Được nối sẵn để làm
```

Ví dụ demo:

> Agent đặt vé máy bay, gửi mail, tạo lịch họp

Thực tế phía sau là:

```text
LLM
+ Gmail API
+ Calendar API
+ Flight API
+ Payment API
+ Auth
+ Workflow
+ Retry logic
+ Permission system
```

Agent không tự có những capability đó.

---

## 8. Demo thường là happy path

Demo:

```text
Input sạch
→ intent rõ
→ API chạy ngon
→ dữ liệu chuẩn
→ kết quả đúng
```

Production:

```text
Input mơ hồ
→ dữ liệu thiếu
→ auth fail
→ API timeout
→ business conflict
→ partial success
```

Độ khó thật nằm ở engineering.

Không nằm ở prompt.

---

## 9. Kết luận quan trọng

Rule dễ nhớ:

```text
LLM = reasoning
Tools = execution
Workflow = control
Dev = architect
```

Với hệ thống nghiệp vụ thật:

- giá trị lớn nhất nằm ở workflow
- data model
- guardrails
- permissions
- observability

Không phải chỉ ở model.

---

## 10. Kết luận áp dụng cho hệ đang xây

Flow hiện tại:

```text
detectIntent
→ extractParams
→ routeIntent
→ productSearch
→ rerankProduct
→ synthesize
```

Trong flow này:

- node = dev viết
- tool = dev viết
- edge = dev viết
- state = dev định nghĩa
- LLM chỉ xử lý reasoning ở các node cần thiết

Đây là hướng:

✅ production-grade  
✅ deterministic  
✅ dễ debug  
✅ dễ audit  
✅ phù hợp ecommerce / O&M / legal / fintech