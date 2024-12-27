import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
    source: string | null;
    components: Partial<Components | null>;
}

const MarkdownRenderer = ({ source, components }: MarkdownRendererProps) => {
    return (
        <ReactMarkdown
            children={source}
            components={components}
            remarkPlugins={[remarkGfm]}
        />
    );
};

export default MarkdownRenderer;
