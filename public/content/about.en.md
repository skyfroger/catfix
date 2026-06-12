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

**Pavel Khoroshevich**, Senior Lecturer at the Department of Computer Science and Methods of Teaching Computer Science, Faculty of Physics and Mathematics, Maxim Tank Belarusian State Pedagogical University.
:::
:::div{.devs__card}
![](anna.jpg)

**Anna Bogomolova**, student at the Faculty of Physics and Mathematics, Maxim Tank Belarusian State Pedagogical University.
:::
:::div{.devs__card}
![](tatyana.jpg)

**Tatsiana Zanko**, student at the Faculty of Physics and Mathematics, Maxim Tank Belarusian State Pedagogical University.
:::
:::div{.devs__card}
![](nikolay.jpg)

**Nikolai Makavets**, student at the Faculty of Physics and Mathematics, Maxim Tank Belarusian State Pedagogical University.
:::
:::div{.devs__card}
![](nikita.jpg)

**Nikita Pankratov**, student at the Faculty of Physics and Mathematics, Maxim Tank Belarusian State Pedagogical University.
:::
:::div{.devs__card}
![](maria.jpg)

**Maria Slovetzkaya**, student at the Faculty of Physics and Mathematics, Maxim Tank Belarusian State Pedagogical University.
:::
::::
You can read more about the project in the [blog](https://cs-labs.netlify.app/blog/posts/2023/08/kotfix/). The source code of the project is hosted on the [GitHub page](https://github.com/skyfroger/catfix).