import { Message } from "@/interfaces/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";

interface AssistantMessageProps {
  message: Message;
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  return (
    <div className="flex w-full gap-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src="/bot-avatar.png" alt="assistant" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2 p-4 bg-muted rounded-lg">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    style={xonokai}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      fontSize: "14px",
                      backgroundColor: "black",
                      border: "none",
                    }}
                    className="w-full mb-4"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    {...props}
                    className="px-1 py-0.5 border rounded-md font-mono text-[13px]"
                  >
                    {children}
                  </code>
                );
              },
              // Enhanced styling for other markdown elements
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mb-4 text-[15px]">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold mb-3 text-[15px]">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold mb-2 text-[15px]">
                  {children}
                </h3>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-4 text-[15px]">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-4 text-[15px]">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="mb-1 text-[15px]">{children}</li>
              ),
              p: ({ children }) => (
                <p className="mb-4 last:mb-0 text-[15px]">{children}</p>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/50 pl-4 italic my-4">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full divide-y divide-border">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2 bg-muted font-medium">{children}</th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 border-t border-border">{children}</td>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
