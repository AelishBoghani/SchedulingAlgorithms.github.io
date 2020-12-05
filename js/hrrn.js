let s = $("#data").html();
let s_animate = $("#animateAll").html();
$(document).ready(function () {
    let arrival = [];
    let burst = [];
    let Completion = [];
    let tat = [];
    let wt = [];
    let arrival_burst = [];
    
    //when add buttton clicked then animation and data in the row are deleted.
    function deleteOther() {
        $("#data").html(s);
        $("#animateAll").html(s_animate);
        makeHide();
    }

    //makevisible other column
    function makeVisible() {
        $(".ans").css("visibility", "visible");
        $(".avg").css("visibility", "visible");
    }

    //Add process
    let lst=1;
    $("#add").click(function () {
        let n = $("#process").val();
        deleteOther();
        for (let i = 1; i < n; i++) {
            $("#data").append(s);
            $("#data .cen").eq(i * 3).text(i);
            lst=i+1;
        }
    });
    
    $("#add_row").click(function(){
        let n=$("#process").val();
        $("#process").val(parseInt(n)+1);
        $("#data").append(s);
        $("#data .cen").eq(lst * 3).text(lst);
        lst++;
    });

    $("#delete_row").click(function(){
        lst--;
        if(lst<0)
        {
            lst=0;
            return;
        }
        $("#process").val(lst);
        $("#data").children(".cen").eq(lst*3+2).remove();
        $("#data").children(".cen").eq(lst*3+1).remove();
        $("#data").children(".cen").eq(lst*3).remove();
        $("#data").children(".ans").eq(lst*3+2).remove();
        $("#data").children(".ans").eq(lst*3+1).remove();
        $("#data").children(".ans").eq(lst*3).remove();
    });
    
    let flg=[];
    //select process
    function check(flg)
    {
        let j=1;
        for(let i=0;i<flg.length;i++)
        {
            if(flg[i]==0)
                j=0;
        }
        return j;
    }

    function select_process(till)
    {
        if(check(flg))
            return -2;
        let n = lst;
        let max=-1,select=-1;
        //console.log(till);
        for(let i=0;i<n && arrival_burst[i][0]<=till;i++)
        {
            let ratio=(till-arrival_burst[i][0]+arrival_burst[i][1])/arrival_burst[i][1];
            if(flg[arrival_burst[i][2]]==0 && max<ratio)
            {
                //console.log(arrival_burst[i][1]);
                max=ratio;
                console.log(ratio);
                select=arrival_burst[i][2];
            }
        }
        //console.log();
        if(select==-1)
        {
            return -1;
        }
        else 
        {
            flg[select]=1;
            return select;
        }
    }

    function afterWaste()
    {
        let n = lst;
        for(let i=0;i<n;i++)
        {
            if(flg[arrival_burst[i][2]]==0)
                return arrival_burst[i][0];
        }
    }
    //Animation function
    function fun_animation() {
        let n = lst;

        let last = 0;
        let i = -1;
        let j;
        while (1) {
            j=select_process(last);
            console.log(j);
            if(j==-2)
            {
                break;
            }
            else if (j==-1){
                i++;
                $("#animateAll").append(s_animate);
                $(".animation").eq(i).css("visibility", "visible");
                $(".animation").eq(i).text("Waste");
                $(".animation").eq(i).css("background-color", "black");
                $(".animation").eq(i).css("color", "white");
                $(".start").eq(i).text(last);
                let next_arrive=afterWaste();
                let cur = 50 * (next_arrive - last);
                $(".animation").eq(i).animate({
                    width: cur
                }, 500);
                last = next_arrive;
                continue;
            }
            let cur = 50 * burst[j];
            i++;
            $("#animateAll").append(s_animate);
            $(".animation").eq(i).css("visibility", "visible");
            $(".animation").eq(i).text("P" + j);
            $(".start").eq(i).text(last);

            if (i % 2)
                $(".animation").eq(i).css("background-color", "lightblue");
            else
                $(".animation").eq(i).css("background-color", "red");

            $(".animation").eq(i).animate({
                width: cur
            }, 1000);
            last = last + burst[j];
            Completion[j]=last;
        }
        i++;
        $("#animateAll").append(s_animate);
        $(".start").eq(i).text(last);
    }

    //algorithm
    $("#compute").click(function () {
        let n = lst;
        let texts = $(".cen").map(function () {
            return $(this).val();
        }).get();
        console.log(texts);

        makeAnimationHide();

        arrival.length = 0;
        burst.length = 0;
        flg.length=0;
        arrival_burst.length=0;

        for (let i = 0; i < texts.length; i++) {
            if (i % 3 == 0)
                continue;
            else if (i % 3 == 1) {
                if (texts[i] == "") {
                    alert("Enter number");
                    makeHide();
                    return;
                }
                arrival.push(parseInt(texts[i]));
                arrival_burst.push([parseInt(texts[i]),parseInt(texts[i + 1]),parseInt( arrival_burst.length)]);
                flg.push(0);
            }
            else {
                if (texts[i] == "") {
                    alert("Enter number");
                    makeHide();
                    return;
                }
                burst.push(parseInt(texts[i]));
            }
        }
        // console.log(process);
        console.log(arrival);
        console.log(burst);
        Completion.length = n;
        wt.length = n;
        tat.length = n;

        arrival_burst = arrival_burst.sort(function (a, b) {  return a[0] - b[0]; });
        //compute Completion time
        // for(let i=0;i<arrival_burst.length;i++)
        // {
        //      console.log(arrival_burst[i][0]+" "+arrival_burst[i][1]);
        // }

        fun_animation();

        let count = 0;
        //compute Turn Around Time and Waiting Time
        while (count < n) {
           // console.log(Completion[count]);
            tat[count] = Completion[count] - arrival[count];
            wt[count] = tat[count] - burst[count];
            count++;
        }

        console.log(Completion);
        console.log(tat);
        console.log(wt);

        //give value to our html table
        var avg_tat=0,avg_wat=0;
        for (let i = 0, j = 0; i < 3 * n; i += 3, j++) {
            $("#data .ans").eq(i).text(Completion[j]);
            $("#data .ans").eq(i + 1).text(tat[j]);
            $("#data .ans").eq(i + 2).text(wt[j]);
            avg_tat+=tat[j];
            avg_wat+=wt[j];
        }

        $("#avg_tat").text(Math.round(avg_tat/n*100)/100);
        $("#avg_wat").text(Math.round(avg_wat/n*100)/100);

        makeVisible();

    });

    function makeAnimationHide()
    {
        $(".animation").css("width", 0);
        $(".animation").css("color", "black");
        $(".animation").text("");
        $(".start").text("");
    }

    //this function make hide and give the text to null
    function makeHide() {
        $(".cen").val("");
        $(".ans").css("visibility", "hidden");
        $(".avg").css("visibility", "hidden");
        // $(".animation").css("visibility","hidden");
        makeAnimationHide();
    }

    //reset the button
    $("#reset").click(makeHide);

});
