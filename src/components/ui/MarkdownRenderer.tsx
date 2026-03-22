import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import ScratchCode from "./ScratchCode";

interface MarkdownRendererProps {
    source: string | null;
    components?: Partial<Components> | null;
}

const defaultComponents: Partial<Components> = {
    code({ className, children, ...props }) {
        const language = /language-(\w+)/.exec(className || "")?.[1];
        const content = String(children).trim();

        // Блочный scratch
        if (language === "scratch") {
            return <ScratchCode code={content} />;
        }

        // Строчный scratch — по префиксу "scratch:"
        if (!language && content.startsWith("scratch:")) {
            const code = content.replace(/^scratch:/, "").trim();
            return <ScratchCode inline={true} code={code} />;
        }

        return (
            <code className={className} {...props}>
                {children}
            </code>
        );
    },
};

const MarkdownRenderer = ({ source, components }: MarkdownRendererProps) => {
    const mergedComponents = {
        ...defaultComponents,
        ...components, // компоненты из пропсов перезаписывают дефолтные
    };

    return (
        <Markdown
            components={mergedComponents}
            remarkPlugins={[
                remarkGfm,
                [remarkToc, { heading: "[Сс]одержание" }],
            ]}
            rehypePlugins={[rehypeSlug]}
        >
            {source}
        </Markdown>
    );
};

export default MarkdownRenderer;
