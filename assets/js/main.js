/* =========================================
   REGISTER GSAP PLUGINS
========================================= */

gsap.registerPlugin(SplitText, Flip);

/* =========================================
   CHECK REDUCED MOTION PREFERENCE
========================================= */

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
).matches;

/* =========================================
   INITIALIZE ANIMATIONS
========================================= */

async function initLeaderboard() {
    // Wait until the browser finishes loading fonts.
    // This helps SplitText calculate the correct character positions.
    await document.fonts.ready;

    const panel = document.querySelector(".leaderboard");
    const rows = gsap.utils.toArray(".player-row");
    const title = document.querySelector(".title");
    const subtitle = document.querySelector(".subtitle");
    const headingKicker = document.querySelector(".heading-kicker");
    const topBar = document.querySelector(".leaderboard-top");
    const tableHead = document.querySelector(".table-head");
    const bottomBar = document.querySelector(".leaderboard-bottom");

    // Keep the page visible if animations are disabled.
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

    /* =====================================
       SPLIT TITLE AND PLAYER NAMES
    ===================================== */

    // SplitText creates individual animated characters.
    const titleSplit = SplitText.create(title, {
        type: "chars",
        charsClass: "char",
        aria: "auto",
    });

    // Create a separate SplitText instance for each player name.
    const playerSplits = rows.map((row) => {
        const name = row.querySelector(".player-name");

        return SplitText.create(name, {
            type: "chars",
            charsClass: "char",
            aria: "auto",
        });
    });

    /* =====================================
       PREPARE INITIAL STATES
    ===================================== */

    // Hide the main interface before the timeline begins.
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

    // The panel itself is visible before its contents animate.
    // This gives us a clean, coordinated entrance.
    const timeline = gsap.timeline({
        defaults: {
            ease: "power3.out",
        },
    });

    /* =====================================
       STEP 1: PANEL
    ===================================== */

    timeline.to(panel, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
    });

    /* =====================================
       STEP 2: TOP STATUS
    ===================================== */

    timeline.to(
        topBar,
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
        },
        "-=0.4",
    );

    /* =====================================
       STEP 3: TITLE
    ===================================== */

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

    /* =====================================
       STEP 4: COLUMN LABELS
    ===================================== */

    timeline.to(
        tableHead,
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
        },
        "-=0.15",
    );

    /* =====================================
       STEP 5: PLAYER ROWS
    ===================================== */

    // Each row enters a little later than the previous one.
    // The overlapping timing keeps the animation fluid.
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

    /* =====================================
       STEP 6: PLAYER NAME REVEALS
    ===================================== */

    // Animate the letters in each row after the rows arrive.
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
            1.45 + index * 0.09,
        );
    });

    /* =====================================
       STEP 7: AVATARS
    ===================================== */

    timeline.to(
        ".avatar",
        {
            scale: 1,
            rotate: 0,
            duration: 0.45,
            stagger: 0.07,
            ease: "back.out(2)",
        },
        1.4,
    );

    /* =====================================
       STEP 8: WIN RATE BARS
    ===================================== */

    timeline.to(
        ".rate-track span",
        {
            scaleX: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.out",
        },
        1.7,
    );

    /* =====================================
       STEP 9: ACHIEVEMENT ICONS
    ===================================== */

    timeline.to(
        ".achievement",
        {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: 0.45,
            stagger: 0.07,
            ease: "back.out(2)",
        },
        1.65,
    );

    /* =====================================
       STEP 10: BOTTOM STATUS
    ===================================== */

    timeline.to(
        bottomBar,
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
        },
        "-=0.2",
    );

    /* =====================================
       HOVER EFFECTS
    ===================================== */

    rows.forEach((row) => {
        const avatar = row.querySelector(".avatar");
        const achievement = row.querySelector(".achievement");

        // Use GSAP for a smooth lift when the pointer enters.
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

        // Return everything to its original position.
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

    /* =====================================
       DYNAMIC RANK ANIMATION WITH FLIP
    ===================================== */

    const boostButton = document.querySelector("#boost-player");
    const resetButton = document.querySelector("#reset-ranks");
    const playerList = document.querySelector(".player-list");

    // Remember the original XP scores so RESET restores the leaderboard.
    const initialScores = new Map(
        rows.map((row) => [
            row,
            Number(
                row.querySelector(".xp-value").textContent.replace(/,/g, ""),
            ),
        ]),
    );

    // Format XP values consistently, including thousands separators.
    const formatXP = (value) => value.toLocaleString("en-US");

    // Keep track of the last highlighted player.
    let highlightedRow = null;
    let rankAnimationRunning = false;

    /* =====================================
       UPDATE RANKS AND MEDALS
    ===================================== */

    function updateRankDetails() {
        const currentRows = [...playerList.children];

        currentRows.forEach((row, index) => {
            const rank = index + 1;
            const rankElement = row.querySelector(".rank");
            const achievement = row.querySelector(".achievement");
            const achievementIcon = achievement.querySelector("i");

            // Update the visible rank number.
            rankElement.textContent = String(rank).padStart(2, "0");

            // Remove old ranking classes before assigning new ones.
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

            // The top three positions receive special styling and medals.
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

    /* =====================================
       ANIMATE A LEADERBOARD UPDATE
    ===================================== */

    function animateRanking(scoreUpdater) {
        // Prevent another click from interrupting an active rank animation.
        if (rankAnimationRunning) return;

        rankAnimationRunning = true;
        boostButton.disabled = true;
        resetButton.disabled = true;

        const previousOrder = [...playerList.children];

        // FLIP captures the current positions before the DOM changes.
        const state = Flip.getState(previousOrder);

        // Apply score changes before sorting the list.
        scoreUpdater();

        // Sort players by XP, highest score first.
        const sortedRows = [...previousOrder].sort((a, b) => {
            const scoreA = Number(
                a.querySelector(".xp-value").textContent.replace(/,/g, ""),
            );

            const scoreB = Number(
                b.querySelector(".xp-value").textContent.replace(/,/g, ""),
            );

            return scoreB - scoreA;
        });

        // Move the existing row elements into their new positions.
        // This preserves their contents and event listeners.
        sortedRows.forEach((row) => {
            playerList.appendChild(row);
        });

        // Update ranks and medals after reordering the rows.
        updateRankDetails();

        // Find which players changed position.
        const movedRows = sortedRows.filter(
            (row, index) => previousOrder[index] !== row,
        );

        // FLIP animates from the captured positions to the new positions.
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

                // Clear the previous highlight.
                if (highlightedRow) {
                    highlightedRow.classList.remove("rank-changed");
                }

                // Highlight the players who moved.
                movedRows.forEach((row) => {
                    row.classList.add("rank-changed");
                });

                highlightedRow = movedRows[0] || null;

                // Fade the highlights away after the movement finishes.
                gsap.delayedCall(1.3, () => {
                    movedRows.forEach((row) => {
                        row.classList.remove("rank-changed");
                    });

                    highlightedRow = null;
                });
            },
        });
    }

    /* =====================================
       BOOST A RANDOM PLAYER
    ===================================== */

    boostButton.addEventListener("click", () => {
        animateRanking(() => {
            const currentRows = [...playerList.children];

            // Choose a player outside the first position.
            const candidates = currentRows.slice(1);

            const randomIndex = Math.floor(Math.random() * candidates.length);

            const chosenPlayer = candidates[randomIndex];

            const xpElement = chosenPlayer.querySelector(".xp-value");

            const currentXP = Number(xpElement.textContent.replace(/,/g, ""));

            // Add enough XP to make a noticeable move up the rankings.
            const bonusXP = Math.floor(5000 + Math.random() * 8000);

            xpElement.textContent = formatXP(currentXP + bonusXP);
        });
    });

    /* =====================================
       RESET TO THE ORIGINAL RANKINGS
    ===================================== */

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

/* =========================================
   START THE EXPERIENCE
========================================= */

initLeaderboard();
