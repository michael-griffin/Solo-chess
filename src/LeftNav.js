import React from "react"

function LeftNav(){
    //props
    //Main idea: Hovering over each button should add an extra submenu, superimposed over board.
    //Previously, did this with CSS fanciness (.classname:hover {display: block})
    //Previous Comments:
    //want each link to be a container, with an icon on left, text on right, both linking to a new page.
    //Old version added classes based on hover. Still maybe doable?
        //Seems closer to a job for state + re-rendering Nav.
        //Simpler if we could do full list
        //and make a subset visible on hover

    //Play (maybe skip extra menu, just default to solo chess).
        //Solo chess
            //Atomic Chess?
            //Horde?

    //Puzzles
        //Puzzle Streak (no time-limit, one skip per puzzle? Session? Hint?)
        //Puzzle Storm
        //Custom Puzzles (revisit past, select by type).

    //Learn
        //Openings
        //Endgames
        //Drills
        //Lessons

    return (
        <nav className="leftnav">
            <div className="leftnav-base">
                <div className="navbase navhome">
                    <a className="nav-link" href="#">
                        <img src="icons/sitelogo.png" />
                    </a>
                </div>
                <div className="navbase navplay">
                    <img src="icons/playwhite.svg" />
                    <span className="leftnav-text">Play</span>
                </div>
                <div className="navbase navpuzzles">
                    <img src="icons/puzzles.svg" />
                    <span className="leftnav-text">Puzzles</span>
                </div>
                <div className="navbase navlessons">
                    <img src="icons/lessons.svg" />
                    <span className="leftnav-text">Learn</span>
                </div>
                <div className="navbase navsignup">Sign Up</div>
                <div className="navbase navlogin">Log In</div>
            </div>
            <div className="leftnav-extra">
                <div className="extraplay playperson">Play Person</div>
                <div className="extraplay playcomp">Play Computer</div>
                <div className="extraplay playvariants">Play Variants</div>
            </div>
        </nav>
    )
}

export default LeftNav;