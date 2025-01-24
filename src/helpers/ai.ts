import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "./env";

const genAI = new GoogleGenerativeAI(env.ai.apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const aiSummarise = async (diff: string) => {
  const response = await model.generateContent(`
    You are an expert programmer analyzing the changes in the following Git commit diff. Summarize the changes with precision and technical accuracy. Highlight key file-level changes, logic updates, and structural or functional improvements made in the codebase. Be concise but include relevant details to convey the intent and impact of the changes.

    Provide the summary for the following commit:

    **Diff Content:**

    \`\`\`diff
    ${diff}
    \`\`\`

    **Output format:**
    1. **File(s) Changed:** {list of files}
    2. **Key Modifications:**
       - {description of changes at a high level}
    3. **Purpose/Impact:**
       - {describe the goal of this commit and its impact on the codebase}
  `);

  return response.response.text();
};

// Example usage:
(async () => {
  const diff = `diff --git a/cache/redis.go b/cache/redis.go
index 4ed42d3..f1b3e86 100644
--- a/cache/redis.go
+++ b/cache/redis.go
@@ -5,7 +5,7 @@ import (
 	"fmt"
 	"time"
 
-	"github.com/Ashutowwsh/dns-server-go/config"
+	"github.com/Ashutowsh/dns-server-go/config"
 	"github.com/redis/go-redis/v9"
 )
 
diff --git a/db/postgres.go b/db/postgres.go
index cb38967..41051a1 100644
--- a/db/postgres.go
+++ b/db/postgres.go
@@ -16,6 +16,14 @@ type DNSLog struct {
 	Response  string
 }
 
+type DNSRecord struct {
+	ID     uint   \`gorm:"primaryKey"\`
+	Domain string \`gorm:"index;not null"\`
+	Type   string \`gorm:"not null"\`
+	Value  string \`gorm:"not null"\`
+	TTL    int    \`gorm:"not null"\`
+}
+
 type PostgresDB struct {
 	Client *gorm.DB
 }

... [TRUNCATED FOR BREVITY] ...`;

  // Call the AI summarization function and log the output
  const summary = await aiSummarise(diff);
  console.log(summary);
})();
