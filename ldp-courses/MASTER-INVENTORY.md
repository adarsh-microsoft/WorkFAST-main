# LDP Master Inventory

**Source:** https://ldp.maqsoftware.com  
**User:** adarshd@maqsoftware.com (UserID 4477)  
**Captured via:** `POST /tracks/GetTracksAndSpecializations` + `POST /specializations/GetSpecializationDetails`  
**Status:** No course was started or modified during this discovery — read-only inventory only.

> **Lookup helper:** Use [inventory.json](inventory.json) for the machine-readable schema. This file is the human-friendly view.  
> **For "complete course X" requests:** locate the spec by code/name below, note `specId`, courses, and `passingPct`, then route to `ldp-course-automate` with the spec URL `https://ldp.maqsoftware.com/tracks/specialization/{specId}`.

---

## Summary

| Metric | Value |
|--------|-------|
| Tracks | 7 |
| Specializations | 90 |
| Courses (total quiz + module items) | 192 |
| Specs **Completed** | 9 |
| Specs **In Progress** | 5 |
| Specs **Not Started** | 76 |

### Tracks

| # | Track | # Specs |
|---|-------|---------|
| 1 | Azure + BI | 23 |
| 2 | Frontend | 14 |
| 3 | Power Platform | 10 |
| 4 | Process | 22 |
| 5 | Domain | 14 |
| 6 | Machine Learning | 5 |
| 7 | Power BI | 2 |

### Status Snapshot

**Completed (9):**
- specId 5 — `[BA-PE101] Analyzing Data with Microsoft Power BI`
- specId 18 — `Azure DevOps`
- specId 39 — `[FE-PE102] React Library`
- specId 89 — `[AZR-PE107] Fabric 101`
- specId 100 — `[PR-PE113] Security and Privacy - 2`
- specId 1109 — `[AZR-PE204] Designing and Building Data Solutions with Microsoft Fabric`
- specId 1111 — `[PR-PE115] AI Tools for Software Development`
- specId 1114 — `FE-PE113 Accessibility Standards and Development`
- specId 1115 — `[ML-PE107] Microsoft Applied AI & Business Solutions`

**In Progress (5):**
- specId 7 — `[FE-PE101] Front-end Development` (existing repo folder)
- specId 16 — `[BA-PE103] Microsoft Power Platform + Dynamics 365 Core` ⭐
- specId 24 — `[BA-PE107] Power BI Embedded`
- specId 27 — `[AZR-PE101] Implementing an Azure Data Solution` ⭐
- specId 40 — `[FE-PE301] Advanced Front-end Development` ⭐

**Favourites (⭐):** 5, 16, 27, 40, 48, 1115

---

## Per-Track Detail

Legend: `M` = totalModule · `Q` = totalQuiz · `q` = quiz course · `m` = module course · `pct` = passing percentage

### 1. Azure + BI (23 specs)

| specId | Code / Name | Status | M / Q | Courses |
|--------|-------------|--------|-------|---------|
| 1 | [SQL-PE101] Querying Data with Transact-SQL | Not Started | 1 / 2 | m1 SQL (42, 70%) · q14 T-SQL Quiz (11, 70%) · q27 LDP SQL Quiz (45, 70%) |
| 2 | [SQL-PE201] Developing SQL Databases | Not Started | 1 / 1 | q20 Developing SQL Databases Quiz (29, 70%) · m29 Developing SQL Databases Course (21, 70%) |
| 3 | [BI-PE101] Implementing a Data Warehouse Using SQL | Not Started | 1 / 1 | m3 SSIS (10, 60%) · q17 SSIS Quiz (31, 70%) |
| 4 | [BI-PE201] Developing SQL Data Models | Not Started | 1 / 1 | m12 SSAS (30, 70%) · q15 SSAS Quiz (21, 70%) |
| 14 | Azure Databricks | Not Started | 1 / 1 | m28 Azure Databricks (63, 70%) · q63 Azure Databricks Weekly Quiz (60, 90%) |
| 23 | Miscellaneous SQL | Not Started | 1 / 0 | m30 LDP SQL 2017 (35, 70%) |
| 27 | [AZR-PE101] Implementing an Azure Data Solution ⭐ | **In Progress** | 1 / 3 | q42 DP-200 Quiz (89, 75%) · q79 Azure Databricks Quiz (10, 70%) · q80 Azure Data Factory Quiz (10, 70%) · m126 Implementing an Azure Data Solution (8, 90%) |
| 28 | [AZR-PE102] Developing Solutions for Microsoft Azure | Not Started | 1 / 1 | m81 AZ-204 (13, 70%) · q82 AZR-PE102 Quiz (37, 70%) |
| 29 | [AZR-PE202] Microsoft Azure Architect Technologies | Not Started | 1 / 2 | q51 AZ-300 Quiz (98, 70%) · q99 AZ-303 Quiz (37, 70%) · m129 Microsoft Azure Architect Technologies (15, 90%) |
| 30 | [AZR-PE201] Designing an Azure Data Solution | Not Started | 1 / 1 | q55 DP-201 Quiz (24, 70%) · m128 Designing an Azure Data Solution (8, 90%) |
| 32 | [AZR-PE203] Microsoft Azure Architect Design | Not Started | 1 / 1 | q56 AZ-301 Quiz (94, 70%) · m127 Microsoft Azure Architect Design (9, 90%) |
| 33 | AZ-103 Microsoft Azure Administrator | Not Started | 0 / 1 | q59 AZ-103 Quiz (15, 75%) |
| 38 | AZ 500: Microsoft Azure Security Technologies | Not Started | 1 / 0 | m77 AZ 500 (5, 90%) |
| 62 | [AZR-PE103] Azure Synapse Analytics | Not Started | 1 / 0 | m166 Azure Synapse Analytics (7, 80%) |
| 67 | [BI-PE302] Snowflake fundamentals | Not Started | 0 / 1 | q171 Snowflake Quiz 101 (30, 90%) |
| 68 | [BI-PE301] Teradata Training | Not Started | 0 / 1 | q172 Teradata quiz (35, 80%) |
| 79 | [AZR-PE105] Introduction to Microsoft Fabric | Not Started | 1 / 0 | m192 Getting started with Microsoft Fabric (1, 90%) |
| 82 | [BI-PE303] Snowflake fundamentals Part 2 | Not Started | 1 / 0 | m194 Snowflake Level Up (10, 70%) |
| 85 | [AZR-PE106] Introduction to Microsoft Fabric - Part 2 | Not Started | 1 / 0 | m197 Develop solutions using Microsoft Fabric (6, 90%) |
| 89 | [AZR-PE107] Fabric 101 | **Completed** | 1 / 0 | m200 F-PE101 (61, 90%) |
| 95 | [AZR-PE108] Implementing Analytics Solutions Using Microsoft Fabric | Not Started | 1 / 0 | m213 [AZR-PE108] DP-600 (193, 80%) |
| 1108 | [AZR-PE109] Developing solutions using Databricks | Not Started | 0 / 1 | q1262 Databricks Associate Certification Quiz (44, 70%) |
| 1109 | [AZR-PE204] Designing and Building Data Solutions with Microsoft Fabric | **Completed** | 1 / 0 | m1263 DP-700 (50, 90%) |

### 2. Frontend (14 specs)

| specId | Code / Name | Status | M / Q | Courses |
|--------|-------------|--------|-------|---------|
| 7 | [FE-PE101] Front-end Development | **In Progress** | 2 / 0 | m2 HTML, JS, and CSS (1, 70%) · m25 HTML, CSS and JS Coding Standards (41, 90%) — *(existing repo folder; do not modify)* |
| 39 | [FE-PE102] React Library | **Completed** | 1 / 0 | m72 React JS (76, 70%) |
| 40 | [FE-PE301] Advanced Front-end Development ⭐ | **In Progress** | 1 / 0 | m64 Develop Frontend Expertise (298, 70%) |
| 48 | [FE-PE103] React Library 2 ⭐ | Not Started | 0 / 1 | q132 React JS Quiz (67, 80%) |
| 49 | [FE-PE104] Front-end Development 2 | Not Started | 3 / 2 | m134 HTML & CSS (52, 85%) · m135 JavaScript (36, 85%) · q136 JavaScript Quiz (105, 85%) · q137 HTML & CSS Quiz (112, 85%) · m158 HTML & CSS Assignment (1, 80%) |
| 51 | [FE-PE105] C# 101 | Not Started | 2 / 1 | q138 C# Fundamentals Quiz (100, 80%) · m141 C# Fundamentals (34, 80%) · m177 C# Fundamentals Assignment (1, 70%) |
| 52 | [FE-PE201] C# 201 | Not Started | 1 / 1 | q139 C# Advanced Quiz (62, 80%) · m142 C# Advanced (25, 80%) |
| 58 | [FE-PE107] TypeScript | Not Started | 1 / 1 | m146 TypeScript Course (19, 70%) · q148 TypeScript Quiz (80, 70%) |
| 65 | [FE-PE108] Angular | Not Started | 2 / 1 | q159 Angular Quiz (120, 70%) · m160 Angular Course (31, 70%) · m161 Angular Hands-on assignment (1, 70%) |
| 71 | [MD-PE101] Mobile development with kotlin | Not Started | 2 / 2 | m175 Kotlin (56, 80%) · q176 Kotlin Quiz (43, 80%) |
| 72 | [FE-PE109] React Library 4 | Not Started | 1 / 0 | m179 React JS - Guided Hands on (103, 90%) |
| 73 | [FE-PE110] Blazor - Part 1 | Not Started | 0 / 1 | q182 Blazor Quiz (26, 70%) |
| 77 | [FE-PE112] Blazor - Part 2 | Not Started | 1 / 0 | m188 Blazor Assignment (1, 80%) |
| 1114 | FE-PE113 Accessibility Standards and Development | **Completed** | 2 / 1 | q1273 Accessbility Quiz (51, 80%) · m1274 Accessibility Fundamentals (2, 90%) · m1275 Accessibility Dev Essentials (113, 90%) |

### 3. Power Platform (10 specs)

| specId | Code / Name | Status | M / Q | Courses |
|--------|-------------|--------|-------|---------|
| 16 | [BA-PE103] Microsoft Power Platform + Dynamics 365 Core ⭐ | **In Progress** | 0 / 1 | q40 MB-200 Quiz (20, 70%) |
| 35 | [BA-PE102] Power Platform | Not Started | 3 / 0 | m68 Power Apps (26, 80%) · m70 Power Apps Course (10, 80%) · m95 Power Apps coding standard (10, 100%) |
| 42 | [BA-PE104] Microsoft Dynamics 365 Customer Service | Not Started | 1 / 1 | m83 MB-230 (4, 70%) · q89 MB-230 Quiz (20, 70%) |
| 43 | [BA-PE106] Microsoft Power Platform Developer | Not Started | 1 / 1 | q90 PL-400 Quiz (54, 70%) · m106 PL-400 Assignment (10, 70%) |
| 56 | [BA-PE105] Microsoft Dynamics 365 Customer Engagement | Not Started | 1 / 0 | m156 Dynamics 365 Customer Engagement (7, 90%) |
| 59 | [BA-PE202] Power Platform 201 | Not Started | 2 / 1 | m149 Power Platform 201 (24, 90%) · q150 Power Platform 201 Quiz (125, 90%) · m154 Power Platform 201 Hands-on (4, 90%) |
| 66 | [BA-PE108] Power Platform 101 | Not Started | 2 / 1 | m168 Power Platform Course (39, 90%) · q169 Power Platform Quiz (100, 90%) · m170 Power Platform Assignment (6, 90%) |
| 74 | [BA-PE115] Design Effective Reports in Power BI | Not Started | 1 / 0 | m183 Design Effective Reports In Power BI (1, 85%) |
| 75 | [BA-PE113] Microsoft Power Platform + Dynamics 365 Core | Not Started | 1 / 0 | m185 Power Platform + D365 Core (1, 80%) |
| 1107 | [BA-PE116] Develop agents using Copilot Studio | Not Started | 1 / 0 | m1261 Develop agents using Copilot Studio (4, 100%) |

### 4. Process (22 specs)

| specId | Code / Name | Status | M / Q | Courses |
|--------|-------------|--------|-------|---------|
| 8 | UX | Not Started | 1 / 1 | m7 UX Review (16, 70%) · q122 UX Review Quiz (25, 70%) |
| 9 | Communication | Not Started | 1 / 0 | m8 Communication Skills (698, 70%) |
| 18 | Azure DevOps | **Completed** | 1 / 2 | m6 Azure DevOps (101) (26, 70%) · q21 LDP Azure DevOps Quiz (30, 70%) · q75 LDP Azure DevOps Quiz 2 (67, 70%) |
| 19 | SQL Bootcamp | Not Started | 1 / 0 | m23 SQL Coding Standards (26, 90%) |
| 20 | SSIS Bootcamp | Not Started | 2 / 0 | m24 SSIS Coding Standards (27, 90%) · m26 LDP SSIS (23, 70%) |
| 25 | SAFe | Not Started | 1 / 0 | m36 SAFe (10, 70%) |
| 26 | DataOps | Not Started | 0 / 1 | q41 DataOps Quiz (10, 70%) |
| 37 | MS-500 Microsoft 365 Security Administration | Not Started | 1 / 0 | m76 MS-500 (4, 90%) |
| 50 | [IT-PE104] Microsoft 365 Fundamentals | Not Started | 2 / 0 | m140 MS-900 (20, 80%) · m163 MS-900 Course (3, 90%) |
| 60 | [PR-PE106] Build and Release | Not Started | 1 / 0 | m157 Build and Release Domain Training (46, 80%) |
| 61 | [IT-PE105] Microsoft 365 Identity and Services | Not Started | 1 / 1 | q162 MS-100 Quiz (30, 90%) · m164 MS-100 (4, 90%) |
| 63 | [PR-PE107] Architecture | Not Started | 0 / 1 | q167 ART FA Quiz (28, 90%) |
| 64 | [PR-PE110] HIPAA Compliance | Not Started | 1 / 0 | m165 HIPPA Compliance (18, 90%) |
| 69 | [PR-PE108] UI/UX Design Fundamentals | Not Started | 1 / 0 | m173 Introduction to UI/UX Design for Engineers (37, 70%) |
| 70 | [PR-PE111] Well-Architected Framework | Not Started | 1 / 0 | m174 Microsoft Azure Well-Architected Framework (1, 80%) |
| 98 | [IT-PE106] IT Training | Not Started | 0 / 1 | q215 IT Training Quiz (35, 80%) |
| 99 | [PR-PE112] Azure Release Management Strategy | Not Started | 1 / 0 | m216 Design and Implement a Release Strategy (1, 90%) |
| 100 | [PR-PE113] Security and Privacy - 2 | **Completed** | 0 / 16 | 16 quizzes (Updates, Password, Network, Physical, Secure Coding, Threat Modelling, Social Eng, Phishing, Malware, Deepfake, Good Computing, Ransomware, IoT, Quantum, Device Handling, Supply Chain) |
| 105 | [PR-PE114] Project Delivery Center of Excellence | Not Started | 2 / 0 | m253 Project Scorecard (20, 80%) · m254 ADO Insight (37, 80%) |
| 1111 | [PR-PE115] AI Tools for Software Development | **Completed** | 0 / 2 | q1269 GitHub Copilot Quiz (60, 90%) · q1272 Cursor + Vibe Coding + Playwright Quiz (40, 90%) |
| 1113 | [PR-PE116] GitHub Copilot Fundamentals | Not Started | 1 / 0 | m1271 GitHub Copilot Fundamentals (2, 90%) |
| 1116 | [PR-PE117] SAFe 6.0 | Not Started | 5 / 0 | m1279 Part-1 · m1280 Part-2 · m1281 Part-3 · m1282 Part-4 · m1283 Part-5 (each 10q, 90%) |

### 5. Domain (14 specs)

| specId | Code / Name | Status | M / Q | Courses |
|--------|-------------|--------|-------|---------|
| 15 | [MG-101] LDP PMI - ACP | Not Started | 1 / 0 | m34 LDP PMI - ACP (143, 70%) |
| 31 | Domain Training | Not Started | 7 / 2 | m53 Services Hub Domain Training (193) · q60 CSSBI Quiz (27) · m61 MaSH Domain Training (82) · m93 CAPS Domain training (40) · m101 MLGCS Domain Training (41) · q103 WWL Reporting Quiz (75) · m104 MBR Domain Training (49) · m108 D2 Reporting (51) · m112 CE and S BI Domain Training (40) |
| 44 | GPS Domain Training | Not Started | 10 / 0 | m91 GPS Foundation 101 · m97 GPS Foundation 201 · m98–116 GPS Specialization 202 series + Capstone Project |
| 46 | CSU + STU Domain Training | Not Started | 10 / 0 | m113 CSU/STU Overview · m114 Data Platform · m117 MW Reporting · m118 CSU Azure · m119 MW STU · m120 BA and DMP · m121 CSU Hub Reporting · m123 CSU Finance Reporting · m124 WCB Hub · m125 STU Reporting |
| 47 | Microsoft Power Platform Functional Consultant | Not Started | 0 / 1 | q130 BA - LP103 Study Group Quiz - 1 (56, 70%) |
| 83 | [Center of Excellence S] Supply Chain and Operations | Not Started | 2 / 0 | m195 SCM 101 (72) · m256 SCM 102 (38) |
| 84 | [Center of Excellence R] Retail | Not Started | 2 / 0 | m196 Retail 101 (76) · m257 Retail 102 (39) |
| 90 | MaSH D365 Domain Training | Not Started | 23 / 0 | 23 modules (UJ, SR Service Module Parts 1+2, FM Finance, EVM, MUM, GDC Alpha+Beta, PS, PT, plus 14 SR/MUM/EVM sub-modules) |
| 94 | MCAPS Foundation | Not Started | 2 / 0 | m212 MCAPS 201 (69, 70%) · m1260 MCAPS 202 - Bridging the gap (51, 90%) |
| 96 | MCAPS Advanced | Not Started | 1 / 0 | m214 MCAPS 301 - GPS (88, 70%) |
| 101 | [Center of Excellence F] Finance | Not Started | 1 / 0 | m243 Finance 101 (190, 70%) |
| 104 | [Center of Excellence M] Manufacturing | Not Started | 1 / 0 | m252 Manufacturing 101 (230, 70%) |
| 107 | [Open Source] LinkedIn | Not Started | 5 / 2 | m258 Github · m259 Spark Bootcamp · m260 Spark Jedi · m261 Spark 101 · m262 LinkedIn Ecosystem Bootcamp · q1258 HDFS Quiz (70, 70%) · q1259 Spark Quiz (24, 70%) |
| 1110 | OneBranch/Ev2 | Not Started | 5 / 0 | m1264 Overview & 1ES · m1265 OneBranch Intro · m1266 Ev2 Intro · m1267 OneBranch Advanced · m1268 Ev2 Advanced (each 10q, 80%) |

### 6. Machine Learning (5 specs)

| specId | Code / Name | Status | M / Q | Courses |
|--------|-------------|--------|-------|---------|
| 12 | [ML-PE101] Machine Learning | Not Started | 1 / 0 | m13 Machine Learning (2, 70%) |
| 34 | [ML-PE102] Designing and Implementing an Azure AI Solution | Not Started | 0 / 1 | q65 AI-100 Quiz (50, 70%) |
| 53 | [ML-PE104] Statistics and Probability for Machine Learning | Not Started | 2 / 0 | m143 Statistics for Data Science (1, 100%) · m144 Probability for ML (1, 100%) |
| 55 | [ML-PE106] Introduction to Machine Learning | Not Started | 1 / 1 | q152 Intro to ML Quiz (159, 75%) · m155 Intro to ML Assessment (3, 75%) |
| 1115 | [ML-PE107] Microsoft Applied AI & Business Solutions ⭐ | **Completed** | 3 / 0 | m1276 Transform business workflows with generative AI · m1277 Drive AI transformation · m1278 Intro to M365 and AI administration |

### 7. Power BI (2 specs)

| specId | Code / Name | Status | M / Q | Courses |
|--------|-------------|--------|-------|---------|
| 5 | [BA-PE101] Analyzing Data with Microsoft Power BI ⭐ | **Completed** | 2 / 2 | m4 Power BI (8, 70%) · q16 DA-100 Quiz (30, 70%) · m31 LDP Power BI (54, 70%) · q84 Power BI Quiz (10, 70%) |
| 24 | [BA-PE107] Power BI Embedded | **In Progress** | 2 / 1 | m33 LDP Power BI (Advanced) (30, 70%) · m87 Power BI Embedded (5, 70%) · q88 Power BI Embedded Quiz (22, 70%) |

---

## Notes for Future Automation

- **Don't enroll silently.** A spec only exposes Submit/Upload UI once a course inside it is in the `In Progress` state — see `ldp-rules.md` Type-3 notes.
- **Module URL pattern:** `https://ldp.maqsoftware.com/specializations/{specId}/course/{courseId}` (or `/training/{courseId}` for some flows).
- **Spec landing URL:** `https://ldp.maqsoftware.com/tracks/specialization/{specId}` — shows COURSES tab with enroll cards.
- **Auth:** API calls require Bearer token with audience `88d1db10-af99-4943-8fcb-494b3edaf6c3` (LDP API client). Token lifetime ~60 min.
- **Master endpoint body:** `POST /tracks/GetTracksAndSpecializations` with raw integer body = userId (e.g. `4477`).
- **Detail endpoint body:** `POST /specializations/GetSpecializationDetails` with JSON `{"specId": <int>}`.
