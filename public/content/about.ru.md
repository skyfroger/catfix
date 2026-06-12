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

Приложение помогает оценить Scratch-проект и найти ошибки в скриптах.

::::div{.devs__container}

:::div{.devs__card}

![](pavel.jpg)

**Хорошевич Павел Александрович** старший преподаватель кафедры информатики и методики преподавания информатики физико-математического факультета БГПУ им. Максима Танка.

:::

:::div{.devs__card}

![](anna.jpg)

**Богомолова Анна** студентка физико-математического факультета БГПУ им. Максима Танка.

:::

:::div{.devs__card}

![](tatyana.jpg)

**Занко Татьяна** студентка физико-математического факультета БГПУ им. Максима Танка.

:::

:::div{.devs__card}

![](nikolay.jpg)

**Маковец Николай** студент физико-математического факультета БГПУ им. Максима Танка.

:::

:::div{.devs__card}

![](nikita.jpg)

**Панкратов Никита** студент физико-математического факультета БГПУ им. Максима Танка.

:::


:::div{.devs__card}

![](maria.jpg)

**Словецкая Мария** студентка физико-математического факультета БГПУ им. Максима Танка.

:::

::::


Подробнее о проекте можно почитать в [блоге](https://cs-labs.netlify.app/blog/posts/2023/08/kotfix/). Исходный код проекта размещён на [странице в GitHub](https://github.com/skyfroger/catfix).
