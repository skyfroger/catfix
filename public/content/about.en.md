<style>
    .devs__container{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }

    .devs__card{
        display: flex;
    }

    .devs__card p {
        padding: 0.5em;
    }

    .devs__card img{
        width: 10em;
        border-radius: 50%;
        border: 2px solid #121b33;
        box-shadow: 2px 2px 0 #121b33cf;
    }

    

    .devs__card p strong {
        display: inline-block;
        padding: 0 0.3em;
        background-color: rgb(192, 219, 234);
        box-shadow: 2px 2px 0 #121b33cf;
        border: 1px solid #121b33;
        border-radius: 0.3em;
    }

    @media (max-width: 1300px) {
        .devs__container{
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 950px) {
        .devs__container{
            grid-template-columns: repeat(1, 1fr);
        }

        .devs__card{
            margin-bottom: 1.5em;
            flex-direction: column;
            align-items: center;
        }

        .devs__card p, .devs__card img {
            padding-top: 0;
            margin: 0;
        }

        .devs__card img {
            padding-bottom: 0;
            margin-bottom: 0.2em;
        }
    }

</style>

The application helps evaluate a Scratch project and find errors in scripts.

::::div{.devs__container}

:::div{.devs__card}

![](pavel.jpg)

**Pavel Khoroshevich** Senior Lecturer at the Department of Informatics and Methods of Teaching Informatics, Faculty of Physics and Mathematics, BSPU named after Maxim Tank. Developed the project verification and evaluation system.

:::

:::div{.devs__card}

![](anna.jpg)

**Anna Bogomolova** Student of the Faculty of Physics and Mathematics, BSPU named after Maxim Tank. Developed the system prompt for the chatbot with rules for visualizing the task solution using :a[mermaidjs-диаграмм]{href="https://github.com/mermaid-js/mermaid" target="_blank"}.

:::

:::div{.devs__card}

![](tatyana.jpg)

**Tatiana Zanko** Student of the Faculty of Physics and Mathematics, BSPU named after Maxim Tank. Worked on the introductory part of the system prompt describing the role, tasks, and constraints of the chatbot.

:::

:::div{.devs__card}

![](nikolay.jpg)

**Nikilay Makovets** Student of the Faculty of Physics and Mathematics, BSPU named after Maxim Tank. Developed the system prompt for the chatbot responsible for visualizing Scratch scripts using the markup language :a[scratchblocks]{href="https://github.com/scratchblocks/scratchblocks" target="_blank"}.

:::

:::div{.devs__card}

![](nikita.jpg)

**Nikita Pankratov** Student of the Faculty of Physics and Mathematics, BSPU named after Maxim Tank. Wrote the component for organizing student reflection in the chatbot system prompt.

:::


:::div{.devs__card}

![](maria.jpg)

**Maria Slavetskaya** Student of the Faculty of Physics and Mathematics, BSPU named after Maxim Tank. Worked on the system prompt for the chatbot responsible for conducting Socratic dialogue and Scaffolding (gradual reduction of hints).

:::

::::


More details about the project can be found in the :a[blog]{href="https://cs-labs.netlify.app/blog/posts/2023/08/kotfix/" target="_blank"}. The project source code is available on :a[GitHub page]{href="https://github.com/skyfroger/catfix" target="_blank"}.
