'use client'
import React, { FC, memo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import ReactMarkdown, { Options } from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { FiCopy, FiCheck } from 'react-icons/fi'

interface Props {
  language: string
  value: string
}

interface languageMap {
  [key: string]: string | undefined
}

type MarkdownRendererProps = {
  children: string
}

// CopyButton component
const CopyButton = ({ value }: { value: string }) => {
  const [isCopied, setIsCopied] = React.useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <button
      onClick={copyToClipboard}
      className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
      aria-label="Copy code"
    >
      {isCopied ? (
        <>
          <FiCheck className="text-green-400" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <FiCopy />
          <span>Copy</span>
        </>
      )}
    </button>
  )
}

export const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
)

export const programmingLanguages: languageMap = {
  javascript: '.js',
  python: '.py',
  java: '.java',
  c: '.c',
  cpp: '.cpp',
  'c++': '.cpp',
  'c#': '.cs',
  ruby: '.rb',
  php: '.php',
  swift: '.swift',
  'objective-c': '.m',
  kotlin: '.kt',
  typescript: '.ts',
  go: '.go',
  perl: '.pl',
  rust: '.rs',
  scala: '.scala',
  haskell: '.hs',
  lua: '.lua',
  shell: '.sh',
  sql: '.sql',
  html: '.html',
  css: '.css',
  json: '.json',
  yaml: '.yaml',
  markdown: '.md'
}

const CodeBlock: FC<Props> = memo(({ language, value }) => {
  return (
    <div className="relative my-4 rounded-lg overflow-hidden bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] text-gray-300 text-sm">
        <span className="font-mono">{language || 'code'}</span>
        <CopyButton value={value} />
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        PreTag="div"
        showLineNumbers
        wrapLines
        customStyle={{
          margin: 0,
          background: 'transparent',
          padding: '1rem',
          fontSize: '0.9rem',
          fontFamily: 'var(--font-mono)'
        }}
        lineNumberStyle={{
          minWidth: '2.25em',
          color: '#6e7681',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
})
CodeBlock.displayName = 'CodeBlock'

const MarkdownRenderer: FC<MarkdownRendererProps> = (props) => {
  return (
    <MemoizedReactMarkdown
      className="prose dark:prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none prose-code:bg-gray-100 prose-code:dark:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
        p: ({ node, ...props }) => <p className="my-3 leading-relaxed" {...props} />,
        a: ({ node, ...props }) => <a className="text-blue-600 hover:underline dark:text-blue-400" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600 dark:text-gray-400" {...props} />
        ),
        code({ node, inline, className, children, ...props }) {
          if (children && children.length) {
            if (children[0] == "▍") {
              return <span className="mt-1 animate-pulse">▍</span>;
            }
            children[0] = (children[0] as string).replace("`▍`", "▍");
          }

          const match = /language-(\w+)/.exec(className || "");

          if (inline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }

          return (
            <CodeBlock
              key={Math.random()}
              language={(match && match[1]) || ""}
              value={String(children).replace(/\n$/, "")}
              {...props}
            />
          );
        },
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse my-4" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th className="border px-4 py-2 text-left bg-gray-100 dark:bg-gray-700" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="border px-4 py-2" {...props} />
        ),
      }}
    >
      {props.children}
    </MemoizedReactMarkdown>
  )
}

export default MarkdownRenderer