import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";

interface MarkdownRendererProps {
    source: string | null;
    components: Partial<Components | null>;
}

const MarkdownRenderer = ({ source, components }: MarkdownRendererProps) => {
    return (
        <Markdown
            components={components}
            remarkPlugins={[
                remarkGfm,
                [remarkToc, { heading: "[Сс]одержание" }],
            ]}
        >
            {source}
        </Markdown>
    );
};

export default MarkdownRenderer;
