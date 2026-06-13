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

Дадатак дапамагае ацаніць Scratch-праект і знайсці памылкі ў скрыптах.

::::div{.devs__container}

:::div{.devs__card}

![](pavel.jpg)

**Павел Аляксандравіч Харошэвіч** старшы выкладчык кафедры інфарматыкі і метадыкі выкладання інфарматыкі фізіка-матэматычнага факультэта БДПУ імя Максіма Танка. Распрацаваў сістэму праверкі і ацэньвання праектаў.

:::

:::div{.devs__card}

![](anna.jpg)

**Анна Багамолава** студэнтка фізіка-матэматычнага факультэта БДПУ імя Максіма Танка. Складала сістэмны запыт для чат-бота з правіламі візуалізацыі рашэння задачы з дапамогай :a[mermaidjs-диаграмм]{href="https://github.com/mermaid-js/mermaid" target="_blank"}.

:::

:::div{.devs__card}

![](tatyana.jpg)

**Таццяна Занько** студэнтка фізіка-матэматычнага факультэта БДПУ імя Максіма Танка. Займалася ўводнай часткай сістэмнага запыту з апісаннем ролі, задач і абмежаванняў чат-бота.

:::

:::div{.devs__card}

![](nikolay.jpg)

**Мікалай Макавец** студэнт фізіка-матэматычнага факультэта БДПУ імя Максіма Танка. Складаў сістэмны запыт для чат-бота, які адказвае за візуалізацыю Scratch-скрыптаў з дапамогай мовы разметкі :a[scratchblocks]{href="https://github.com/scratchblocks/scratchblocks" target="_blank"}.

:::

:::div{.devs__card}

![](nikita.jpg)

**Нікіта Панкратаў** студэнт фізіка-матэматычнага факультэта БДПУ імя Максіма Танка. Прапісваў у сістэмным запыце чат-бота кампанент для арганізацыі рэфлексіі вучня.

:::


:::div{.devs__card}

![](maria.jpg)

**Марыя Славецкая** студэнтка фізіка-матэматычнага факультэта БДПУ імя Максіма Танка. Займалася сістэмным запытам для чат-бота, які адказвае за вядзенне Сакратычнага дыялога і Scaffolding (паступовае змяншэнне колькасці падказак).

:::

::::


Падрабязней пра праект можна пачытаць у :a[блогу]{href="https://cs-labs.netlify.app/blog/posts/2023/08/kotfix/" target="_blank"}. Зыходны код праекта размешчаны на :a[старонцы ў GitHub]{href="https://github.com/skyfroger/catfix" target="_blank"}.
