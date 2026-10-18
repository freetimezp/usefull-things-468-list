gsap.registerPlugin(SplitText, Flip);

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
).matches;

// initialize animation
async function initLeaderboard() {
    await document.fonts.ready;

    const panel = document.querySelector(".leaderboard");
    const rows = gsap.utils.toArray(".player-row");
    const title = document.querySelector(".title");
    const subtitle = document.querySelector(".subtitle");
    const headingKicker = document.querySelector(".heading-kicker");
    const topBar = document.querySelector(".leaderboard-top");
    const tableHead = document.querySelector(".table-head");
    const bottomBar = document.querySelector(".leaderboard-bottom");

    if (prefersReducedMotion) {
        gsap.set(
            [
                panel,
                topBar,
                headingKicker,
                title,
                subtitle,
                tableHead,
                rows,
                bottomBar,
            ],
            {
                clearProps: "all",
            },
        );

        return;
    }

    // split text
    const titleSplit = SplitText.create(title, {
        type: "chars",
        charsClass: "char",
        aria: "auto",
    });

    // split player
    const playerSplits = rows.map((row) => {
        const name = row.querySelector(".player-name");

        return SplitText.create(name, {
            type: "chars",
            charsClass: "char",
            aria: "auto",
        });
    });

    // state

    gsap.set(panel, {
        autoAlpha: 0,
        y: 35,
        scale: 0.985,
    });

    gsap.set([topBar, headingKicker, subtitle, tableHead, bottomBar], {
        autoAlpha: 0,
        y: 12,
    });

    gsap.set(titleSplit.chars, {
        autoAlpha: 0,
        yPercent: 110,
        rotateX: -65,
        transformOrigin: "50% 100%",
    });

    gsap.set(rows, {
        autoAlpha: 0,
        x: -24,
    });

    gsap.set(".avatar", {
        scale: 0.7,
        rotate: -12,
    });

    gsap.set(".rate-track span", {
        scaleX: 0,
        transformOrigin: "left center",
    });

    gsap.set(".achievement", {
        autoAlpha: 0,
        scale: 0.5,
        rotate: -20,
    });

    // timaline

    const timeline = gsap.timeline({
        defaults: {
            ease: "power3.out",
        },
    });

    // step 1 - panel

    timeline.to(panel, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
    });

    // step 2 - top status

    timeline.to(
        topBar,
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
        },
        "-=0.4",
    );

    // step 3 - title

    timeline.to(
        headingKicker,
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
        },
        "-=0.15",
    );

    timeline.to(
        titleSplit.chars,
        {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 0.65,
            stagger: 0.045,
            ease: "back.out(1.5)",
        },
        "-=0.1",
    );

    timeline.to(
        subtitle,
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
        },
        "-=0.3",
    );

    // step 4 - labels

    timeline.to(
        tableHead,
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
        },
        "-=0.15",
    );

    // step 5 - rows

    timeline.to(
        rows,
        {
            autoAlpha: 1,
            x: 0,
            duration: 0.55,
            stagger: 0.09,
            ease: "power3.out",
        },
        "-=0.05",
    );

    // step 6 - players names

    playerSplits.forEach((split, index) => {
        timeline.fromTo(
            split.chars,
            {
                autoAlpha: 0,
                y: 9,
                rotateX: -35,
            },
            {
                autoAlpha: 1,
                y: 0,
                rotateX: 0,
                duration: 0.3,
                stagger: 0.018,
                ease: "power2.out",
            },
            2.45 + index * 0.15,
        );
    });

    // step 7 - avatars
    timeline.to(
        ".avatar",
        {
            scale: 1,
            rotate: 0,
            duration: 0.45,
            stagger: 0.11,
            ease: "back.out(2)",
        },
        2.4,
    );

    // step 8 - win rates

    timeline.to(
        ".rate-track span",
        {
            scaleX: 1,
            duration: 0.8,
            stagger: 0.11,
            ease: "power2.out",
        },
        2.7,
    );

    // step 9 - achievement

    timeline.to(
        ".achievement",
        {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: 0.45,
            stagger: 0.11,
            ease: "back.out(2)",
        },
        2.65,
    );

    // step 10 - bottom status

    timeline.to(
        bottomBar,
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
        },
        "-=0.2",
    );

    // hover effect

    rows.forEach((row) => {
        const avatar = row.querySelector(".avatar");
        const achievement = row.querySelector(".achievement");

        row.addEventListener("mouseenter", () => {
            gsap.to(row, {
                y: -2,
                duration: 0.25,
                ease: "power2.out",
                overwrite: "auto",
            });

            gsap.to(avatar, {
                scale: 1.08,
                duration: 0.3,
                ease: "back.out(2)",
                overwrite: "auto",
            });

            gsap.to(achievement, {
                scale: 1.15,
                duration: 0.25,
                overwrite: "auto",
            });
        });

        row.addEventListener("mouseleave", () => {
            gsap.to(row, {
                y: 0,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto",
            });

            gsap.to(avatar, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto",
            });

            gsap.to(achievement, {
                scale: 1,
                duration: 0.25,
                overwrite: "auto",
            });
        });
    });

    // rank flip

    const boostButton = document.querySelector("#boost-player");
    const resetButton = document.querySelector("#reset-ranks");
    const playerList = document.querySelector(".player-list");

    const initialScores = new Map(
        rows.map((row) => [
            row,
            Number(
                row.querySelector(".xp-value").textContent.replace(/,/g, ""),
            ),
        ]),
    );

    const formatXP = (value) => value.toLocaleString("en-US");

    let highlightedRow = null;
    let rankAnimationRunning = false;

    function updateRankDetails() {
        const currentRows = [...playerList.children];

        currentRows.forEach((row, index) => {
            const rank = index + 1;

            const rankElement = row.querySelector(".rank");
            const achievement = row.querySelector(".achievement");
            const achievementIcon = achievement.querySelector("i");

            rankElement.textContent = String(rank).padStart(2, "0");

            row.classList.remove("rank-one", "rank-two", "rank-three");

            rankElement.classList.remove(
                "rank-gold",
                "rank-silver",
                "rank-bronze",
            );

            achievement.classList.remove(
                "achievement-gold",
                "achievement-silver",
                "achievement-bronze",
            );

            // check top three position

            if (rank === 1) {
                row.classList.add("rank-one");

                rankElement.classList.add("rank-gold");
                achievement.classList.add("achievement-gold");

                achievementIcon.className = "fa-solid fa-crown";
            } else if (rank === 2) {
                row.classList.add("rank-two");

                rankElement.classList.add("rank-silver");
                achievement.classList.add("achievement-silver");

                achievementIcon.className = "fa-solid fa-medal";
            } else if (rank === 3) {
                row.classList.add("rank-three");

                rankElement.classList.add("rank-bronze");
                achievement.classList.add("achievement-bronze");

                achievementIcon.className = "fa-solid fa-medal";
            } else {
                achievementIcon.className = "fa-solid fa-shield-halved";
            }
        });
    }

    // leaderboard update

    function animateRanking(scoreUpdater) {
        if (rankAnimationRunning) return;

        rankAnimationRunning = true;

        // console.log("we here");

        boostButton.disabled = true;
        resetButton.disabled = true;

        const previousOrder = [...playerList.children];

        // grab current positions before changes
        const state = Flip.getState(previousOrder);

        scoreUpdater();

        const sortedRows = [...previousOrder].sort((a, b) => {
            const scoreA = Number(
                a.querySelector(".xp-value").textContent.replace(/,/g, ""),
            );

            const scoreB = Number(
                b.querySelector(".xp-value").textContent.replace(/,/g, ""),
            );

            return scoreB - scoreA;
        });

        sortedRows.forEach((row) => {
            playerList.appendChild(row);
        });

        updateRankDetails();

        // find player changed position

        const movedRows = sortedRows.filter(
            (row, index) => previousOrder[index] !== row,
        );

        // Flip to new position

        Flip.from(state, {
            duration: 0.9,
            ease: "power3.inOut",
            stagger: 0.025,
            absolute: false,
            prune: true,

            onComplete: () => {
                rankAnimationRunning = false;

                boostButton.disabled = false;
                resetButton.disabled = false;

                if (highlightedRow) {
                    highlightedRow.classList.remove("rank-changed");
                }

                movedRows.forEach((row) => {
                    row.classList.add("rank-changed");
                });

                highlightedRow = movedRows[0] || null;

                // remove class after change position and highlight
                gsap.delayedCall(1.3, () => {
                    movedRows.forEach((row) => {
                        row.classList.remove("rank-changed");
                    });

                    highlightedRow = null;
                });
            },
        });
    }

    // boost

    boostButton.addEventListener("click", () => {
        animateRanking(() => {
            const currentRows = [...playerList.children];

            const candidates = currentRows.slice(1);

            // random player
            const randomIndex = Math.floor(Math.random() * candidates.length);
            const chosenPlayer = candidates[randomIndex];

            const xpElement = chosenPlayer.querySelector(".xp-value");

            const currentXP = Number(xpElement.textContent.replace(/,/g, ""));

            // random bonus
            const bonusXP = Math.floor(5000 + Math.random() * 8000);

            xpElement.textContent = formatXP(currentXP + bonusXP);
        });
    });

    // reset

    resetButton.addEventListener("click", () => {
        animateRanking(() => {
            rows.forEach((row) => {
                const originalXP = initialScores.get(row);

                row.querySelector(".xp-value").textContent =
                    formatXP(originalXP);
            });
        });
    });
}

initLeaderboard();
