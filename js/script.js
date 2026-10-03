function ReadMoreLess() {
            var dots = document.getElementById("dots");
            var moreText = document.getElementById("more");
            var iMoreLess = document.getElementById("iMoreLess");
            var lblText = document.getElementById("lblText");
            if (dots.style.display === "none") {
                dots.style.display = "inline";
                iMoreLess.className = "fa fa-chevron-right";
                lblText.innerHTML = "Read More";
                moreText.style.display = "none";
            } else {
                dots.style.display = "none";
                iMoreLess.className = "fa fa-chevron-up";
                lblText.innerHTML = "Show Less";
                moreText.style.display = "inline";
            }
        }






