let s = $("#data").html();
let s_IO=$("#data_IO").html();
let s_animate = $("#animateAll").html();
let burst_IO= '<input type="number"class="cen_IO" placeholder="IO" style="width: 60px;"><input type="number" class="cen_IO" placeholder="BT" style="width:60px;">';

$(document).ready(function () {

    let arrival = [];
    let burst = [];
    let Completion = [];
    let tat = [];
    let wt = [];
    let arrival_sort=[];
    let check=false;
    let IO_time=[];
    //toggle of IO
    $("#check").on('change',function(){
        let ans=this.checked;
        if(ans==true)
        {
            check=ans;
            $("#container").css("display","none");
            $("#container_IO").css("display","grid");
            $("#data_IO").css("display","grid");
            $("#data").css("display","none");
            $("#process").val(1);
            deleteOther();
            lst=1;
        }
        else
        {
            check=ans;
            $("#container_IO").css("display","none");
            $("#container").css("display","grid");
            $("#data").css("display","grid");
            $("#data_IO").css("display","none");
            $("#process").val(1);
            deleteOther();
            lst=1;
        }
    });

    //when add buttton clicked then animation and data in the row are deleted.
    function deleteOther() {
        $("#data").html(s);
        $("#data_IO").html(s_IO);
        $("#animateAll").html(s_animate);
        makeHide();
    }

    //makevisible other column
    function makeVisible() {
        $(".ans").css("visibility", "visible");
        $(".avg").css("visibility", "visible");
    }

    //Add process;
    let lst=1;
    $("#add").click(function () {
        let n = $("#process").val();
        deleteOther();
        if(check==false){
            for(let i = 1; i < n; i++) {
                $("#data").append(s);
                $("#data .cen").eq(i * 3).text(i);
                lst=i+1;
            }
        }  
        else
        {
            for(let i = 1; i < n; i++) {
                $("#data_IO").append(s_IO);
                $("#data_IO .cen").eq(i * 4).text(i);
                lst=i+1;
            }
        }
    });
    
    $("#add_row").click(function(){
        let n=$("#process").val();
        $("#process").val(parseInt(n)+1);
        if(check==false){
            $("#data").append(s);
            $("#data .cen").eq(lst * 3).text(lst);
        }
        else
        {
            $("#data_IO").append(s_IO);
            $("#data_IO .cen").eq(lst * 4).text(lst);
        }
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
        if(check==false){
            $("#data").children(".cen").eq(lst*3+2).remove();
            $("#data").children(".cen").eq(lst*3+1).remove();
            $("#data").children(".cen").eq(lst*3).remove();
            $("#data").children(".ans").eq(lst*3+2).remove();
            $("#data").children(".ans").eq(lst*3+1).remove();
            $("#data").children(".ans").eq(lst*3).remove();
        }
        else
        {
            $("#data_IO").children(".cen").eq(lst*4+3).remove();
            $("#data_IO").children(".cen").eq(lst*4+2).remove();
            $("#data_IO").children(".cen").eq(lst*4+1).remove();
            $("#data_IO").children(".cen").eq(lst*4).remove();
            $("#data_IO").children(".ans").eq(lst*3+2).remove();
            $("#data_IO").children(".ans").eq(lst*3+1).remove();
            $("#data_IO").children(".ans").eq(lst*3).remove();
        }
    }); 


    //if input value of the Total IO will change then bt and io will be added in the burst time..
    setInterval(function(){
            for(let i=0;i<lst;i++)
        {
            // console.log("in",i);
            $("#data_IO").children(".cen").eq(i*4+1).change(function(){
                let t=$("#data_IO").children(".cen").eq(i*4+1).val();
                console.log("t=",t);
                $("#data_IO div").eq(i).html('<input type="number" class="cen_IO" placeholder="BT" style="width:60px;">');
                for(let j=0;j<t;j++)
                {
                    $("#data_IO div").eq(i).append(burst_IO);
                }
            });
        }

    }, 1000);

    //Animation function
    function fun_animation() 
    {
        let n = lst;
        console.log(n);
        let last = 0;
        let i = -1;
        for (let j = 0; j < n; j++) {
            if (last < arrival_sort[j][0]) {
                i++;
                $("#animateAll").append(s_animate);
                $(".animation").eq(i).css("visibility", "visible");
                $(".animation").eq(i).text("Waste");
                $(".animation").eq(i).css("background-color", "black");
                $(".animation").eq(i).css("color", "white");
                $(".start").eq(i).text(last);
                let cur = 50 * (arrival_sort[j][0] - last);
                $(".animation").eq(i).animate({
                    width: cur
                }, 500);
                last = arrival_sort[j][0];
                j--;
                continue;
            }
            let cur = 50 * burst[arrival_sort[j][1]];
            i++;
            $("#animateAll").append(s_animate);
            $(".animation").eq(i).css("visibility", "visible");
            $(".animation").eq(i).text("P" + arrival_sort[j][1]);
            $(".start").eq(i).text(last);

            if (j % 2)
                $(".animation").eq(i).css("background-color", "lightblue");
            else
                $(".animation").eq(i).css("background-color", "red");

            $(".animation").eq(i).animate({
                width: cur
            }, 1000);
            last = Completion[arrival_sort[j][1]];
        }
        i++;
        $("#animateAll").append(s_animate);
        $(".start").eq(i).text(last);
    }


    function select_process(cur,ready_queue)
    {
        let select=-1;
        if(ready_queue.length==0)
        {
            return -2;   
        }
        let first=ready_queue.peek();
        if(first[0]>cur)
        {
            return -1;
        }
        else
        {
            ready_queue.dequeue();
            let ind=first[1];
            let burst_cur=burst[ind][0];
            if(burst[ind].length>1)
                ready_queue.queue([cur+burst_cur+burst[ind][1],first[1]]);
            burst[ind].shift();
            burst[ind].shift();
            first[0]=burst_cur;
            select=first;
        }
        return select;
    }


    function fun_IO_animation()
    {
        let n = lst;
        var ready_queue = new PriorityQueue({ comparator: function(a, b) { return a[0] - b[0]; }});
        let last = 0;
        let i = -1;
        let j;
        for(let i=0;i<arrival_sort.length;i++)
        {
            //we have pushed the (arrival_index,arrval_time) when it enters in the ready queue;
            ready_queue.queue(arrival_sort[i]);
        }
        while (1) {
            j=select_process(last,ready_queue);
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
                let next_arrive=ready_queue.peek();
                let cur = 50 * (next_arrive[0] - last);
                $(".animation").eq(i).animate({
                    width: cur
                }, 500);
                last = next_arrive[0];
                continue;
            }
            let cur = 50 * j[0];
            i++;
            $("#animateAll").append(s_animate);
            $(".animation").eq(i).css("visibility", "visible");
            $(".animation").eq(i).text("P" + j[1]);
            $(".start").eq(i).text(last);

            if (i % 2)
                $(".animation").eq(i).css("background-color", "lightblue");
            else
                $(".animation").eq(i).css("background-color", "red");

            $(".animation").eq(i).animate({
                width: cur
            }, 1000);
            last = last + j[0];
            //console.log("j[1]=",j[1]);
            if(burst[j[1]].length==0)
                Completion[j[1]]=last;
        }
        i++;
        $("#animateAll").append(s_animate);
        $(".start").eq(i).text(last);
    }

    //algorithm
    $("#compute").click(function () {
        
        makeAnimationHide();

        let n = lst;
        //console.log(n);
        let total_Burst=[];
        if(check==false)
        {   
            let texts = $("#data .cen").map(function () {
                return $(this).val();
            }).get();
            console.log(texts);

            arrival.length = 0;
            burst.length = 0;
            arrival_sort.length=0;

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
                    arrival_sort.push([parseInt(texts[i]),arrival_sort.length]);
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
        }
        else
        {
            let texts = $("#data_IO .cen").map(function () {
                return $(this).val();
            }).get();
            let allBT=$("#data_IO .cen_IO").map(function () {
                return $(this).val();
            }).get();

            console.log(texts);

            arrival.length = 0;
            burst.length = 0;
            arrival_sort.length=0;
            IO_time.length=0;
            let index=-1;
            for (let i = 0; i < texts.length; i++) {
                if (i % 4 == 0)
                    continue;
                else if (i % 4 == 1) {
                    if (texts[i] == "") {
                        alert("Enter number");
                        makeHide();
                        return;
                    }
                IO_time.push(parseInt(texts[i]));
                }
                else if(i%4==2){
                    if (texts[i] == "") {
                        alert("Enter number");
                        makeHide();
                        return;
                    }
                    arrival.push(parseInt(texts[i]));
                    arrival_sort.push([parseInt(texts[i]),arrival_sort.length]);
                }
                else
                {
                    let array=[];
                    index++;
                    let b=0;
                    array.push(parseInt(allBT[index]));
                    b+=parseInt(allBT[index]);
                    if(IO_time[IO_time.length-1]>0)
                    {
                        for(let j=0;j<IO_time[IO_time.length-1];j++)
                        {
                            index++;
                            array.push(parseInt(allBT[index]));
                            index++;
                            array.push(parseInt(allBT[index]));
                            b+=parseInt(allBT[index]);
                        }
                    }
                    console.log(array);
                    burst.push(array);
                    total_Burst.push(b);
                }
            }
        }
        // console.log(process);
        console.log(arrival);
        console.log(burst);
        Completion.length = n;
        wt.length = n;
        tat.length = n;
        let count = 0, last = 0;

        arrival_sort = arrival_sort.sort(function (a, b) {  return a[0] - b[0]; });
        // consol.log(arrival_sort.sort());
        console.log(arrival_sort);
        //compute Completion time
        if(check==false){
            while (count < n) {
                if (last >= arrival_sort[count][0])
                    Completion[arrival_sort[count][1]] = last + burst[arrival_sort[count][1]];
                else {
                    last = arrival_sort[count][0];
                    Completion[arrival_sort[count][1]] = last + burst[arrival_sort[count][1]];
                }
                last = Completion[arrival_sort[count][1]];
                count++;
            }
        }
        else
        {
            fun_IO_animation();
        }
        count = 0;
        //compute Turn Around Time and Waiting Time
        if(check==true)
        {
            while (count < n) {
                tat[count] = Completion[count] - arrival[count];
                wt[count] = tat[count] - total_Burst[count];
                count++;
            }    
        }
        else
        {
            while (count < n) {
                tat[count] = Completion[count] - arrival[count];
                wt[count] = tat[count] - burst[count];
                count++;
            }
        }

        console.log(Completion);
        console.log(tat);
        console.log(wt);
        
        //give value to our html table
        var avg_tat=0,avg_wat=0;
        if(check==false){
            for (let i = 0, j = 0; i < 3 * n; i += 3, j++) {
                $("#data .ans").eq(i).text(Completion[j]);
                $("#data .ans").eq(i + 1).text(tat[j]);
                $("#data .ans").eq(i + 2).text(wt[j]);
                avg_tat+=tat[j];
                avg_wat+=wt[j];
            }
        }
        else
        {
            for(let i = 0, j = 0; i < 3 * n; i += 3, j++) {
                $("#data_IO .ans").eq(i).text(Completion[j]);
                $("#data_IO .ans").eq(i + 1).text(tat[j]);
                $("#data_IO .ans").eq(i + 2).text(wt[j]);
                avg_tat+=tat[j];
                avg_wat+=wt[j];
            }
        }

        $("#avg_tat").text(Math.round(avg_tat/n*100)/100);
        $("#avg_wat").text(Math.round(avg_wat/n*100)/100);

        makeVisible();

        if(check==false)
            fun_animation();

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
        makeAnimationHide();
        // $(".animation").css("visibility","hidden");
    }

    //reset the button
    $("#reset").click(makeHide);
    
});