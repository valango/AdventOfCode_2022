# Advent Of Code '2022

My [adventofcode.com](https://adventofcode.com) adventures.<br />

Right in time I had no time 😄, so I came back to this 11 months later.

## Diary

* `Day 01` **Calorie Counting**: simple summing and sorting -- spent most of the time trying to remember how to use my fancy runner.
* `Day 02` **Rock Paper Scissors**: simple game strategy modeling.
* `Day 03` **Rucksack Reorganization**: simple summing and sorting.
* `Day 04` **Camp Cleanup**: simple number sets operations.
* `Day 05` **Supply Stacks**: simple stacks manipulations.
* `Day 06` **Tuning Trouble**: simple numeric sequences analyse.
* `Day 07` **No Space Left On Device**: simple filesystem tree emulation.
* `Day 08` **Treetop Tree House**: simple 3D terrain emulation.
* `Day 09.1` **Rope Bridge**: kinda Turtle Graphics emulation. Puzzle #1: 51 min and _answer too low_. In 5 min the cause was found: input parsing error.
* `Day 09.2` Did not understand the description first; the wasted crazy amount of time because of wrong <length> argument value.<br>
To figure out what goes wrong, I had to write a dedicated renderer!
* `Day 10` **Cathode-Ray Tube**: #1 was super-simple; #2 involved reading of lengthy explanations.
* `Day 11` **Monkey in the Middle**:
   - #1 was simple computation based on quite wordy and hard to perceive explanation.
   - #2 previous brute force solution failed w arithmetic overflow; it took some arithmetic analysis to find proper solution. 💥 Pretty cool!
* `Day 12` ** Hill Climbing Algorithm**:
   - #1 it appears that the input data is invalid: comparing `day12.out.txt` w input data reveals there is no adjacendt `p` for existing `q`!

## Track record

| day|lines| mins1 | mins2 | M1_µs | M2_µs |D1_µs|D2_µs|
|---:|---:|------:|------:|------:|------:|---:|---:|
|01|55|       |       |    64 |     1 |4|1|
|02|62|       |       |   770 |   796 |2|2|
|03|90|       |       |   439 |   698 |112|15|
|04|56|       |       |   283 |   247 |3|3|
|05|89|       |       |   303 |   121 |4|2|
|06|53|       |       |   278 |   341 |2|1|
|07|150|       |       |  1933 |    24 |131|25|
|08|144|       |       |  1399 |  1886 |122|75|
|09|117|    56 |    3h | 12507 | 11513 |1621|622|
|10|63|    25 |    40 |    21 |   329 |27|1244|
|11|106|    30 |    3h |1788|76862|575|13704|
|12|104|


The puzzle #2 time is often shorter, because the bulk of computations often happens during the #1 already.

![](quote.png)

## The older ones
* [2021](https://github.com/valango/adventOfCode_2021);
* [2020](https://github.com/valango/adventOfCode);
* [2015](https://github.com/valango/AdventOfCode_2015).
