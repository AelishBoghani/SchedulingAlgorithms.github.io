let s = $("#data").html();
let s_IO = $("#data_IO").html();
let s_animate = $("#animateAll").html();
let burst_IO = '<input type="number"class="cen_IO" placeholder="IO" style="width: 60px;"><input type="number" class="cen_IO" placeholder="BT" style="width:60px;">';

$(document).ready(function () {

    let arrival = [];
    let burst = [];
    let Completion = [];
    let tat = [];
    let wt = [];
    let arrival_process = [];
    let queue = [];
    let check = false;
    let flag = 0;
    let fin_burst = [];
    let check2 = false;
    let arrival_sort=[];
    let total_Burst=[];
    let IO_time=[];
    //check toggle
    $("#check").on('change', function () {
        check = this.checked;
        deleteOther();
    });

    $("#check1").on('change', function () {
        let ans = this.checked;
        console.log(ans);
        if (ans == true) {
            check2 = ans;
            $("#container").css("display", "none");
            $("#container_IO").css("display", "grid");
            $("#data_IO").css("display", "grid");
            $("#data").css("display", "none");
            $("#process").val(1);
            deleteOther();
            lst = 1;
        }
        else {
            check2 = ans;
            $("#container_IO").css("display", "none");
            $("#container").css("display", "grid");
            $("#data").css("display", "grid");
            $("#data_IO").css("display", "none");
            $("#process").val(1);
            deleteOther();
            lst = 1;
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

    //Add process
    let lst = 1;
    $("#add").click(function () {
        let n = $("#process").val();
        deleteOther();
        if (check2 == false) {
            for (let i = 1; i < n; i++) {
                $("#data").append(s);
                $("#data .cen").eq(i * 4).text(i);
                lst = i + 1;
            }
        }
        else {
            for (let i = 1; i < n; i++) {
                $("#data_IO").append(s_IO);
                $("#data_IO .cen").eq(i * 5).text(i);
                lst = i + 1;
            }
        }
    });

    $("#add_row").click(function () {
        let n = $("#process").val();
        $("#process").val(parseInt(n) + 1);
        if (check2 == false) {
            $("#data").append(s);
            $("#data .cen").eq(lst * 4).text(lst);
        }
        else {
            $("#data_IO").append(s_IO);
            $("#data_IO .cen").eq(lst * 5).text(lst);
        }
        lst++;
    });

    $("#delete_row").click(function () {
        lst--;
        if (lst <= 0) {
            lst = 1;
            return;
        }
        $("#process").val(lst);
        if (check2 == false) {
            $("#data").children(".cen").eq(lst * 4 + 3).remove();
            $("#data").children(".cen").eq(lst * 4 + 2).remove();
            $("#data").children(".cen").eq(lst * 4 + 1).remove();
            $("#data").children(".cen").eq(lst * 4).remove();
            $("#data").children(".ans").eq(lst * 3 + 2).remove();
            $("#data").children(".ans").eq(lst * 3 + 1).remove();
            $("#data").children(".ans").eq(lst * 3).remove();
        }
        else {
            $("#data_IO").children(".cen").eq(lst * 5 + 4).remove();
            $("#data_IO").children(".cen").eq(lst * 5 + 3).remove();
            $("#data_IO").children(".cen").eq(lst * 5 + 2).remove();
            $("#data_IO").children(".cen").eq(lst * 5 + 1).remove();
            $("#data_IO").children(".cen").eq(lst * 5).remove();
            $("#data_IO").children(".ans").eq(lst * 3 + 2).remove();
            $("#data_IO").children(".ans").eq(lst * 3 + 1).remove();
            $("#data_IO").children(".ans").eq(lst * 3).remove();
        }
    });

    //if input value of the Total IO will change then bt and io will be added in the burst time..
    setInterval(function () {
        for (let i = 0; i < lst; i++) {
            // console.log("in",i);
            $("#data_IO").children(".cen").eq(i * 5 + 1).change(function () {
                let t = $("#data_IO").children(".cen").eq(i * 5 + 1).val();
                console.log("t=", t);
                $("#data_IO div").eq(i).html('<input type="number" class="cen_IO" placeholder="BT" style="width:60px;">');
                for (let j = 0; j < t; j++) {
                    $("#data_IO div").eq(i).append(burst_IO);
                }
            });
        }

    }, 1000);

    //select process
    function addQueue(last) {
        let n = lst;
        for (let i = flag; i < n && arrival_process[i][0] <= last; i++) {
            // console.log(flag+" "+i);
            queue.push(arrival_process[i][2]);
            flag++;
        }
    }

    let flg = [];
    //select process
    function check1(flg) {
        let j = 1;
        for (let i = 0; i < flg.length; i++) {
            if (flg[i] == 0)
                j = 0;
        }
        return j;
    }

    function select_process(till) {
        if (check2 == false) {
            if (check == true) {
                if (check1(flg)) { return -2; }
            }
            let n = lst;
            let min = 1e18, select = -1;
            //console.log(till);
            if (check == true) {
                for (let i = 0; i < n && arrival_process[i][0] <= till; i++) {
                    if (flg[arrival_process[i][3]] == 0 && min > arrival_process[i][1]) {
                        //console.log(arrival_process[i][1]);
                        min = arrival_process[i][1];
                        select = arrival_process[i][3];
                    }
                }
                //console.log();
                if (select == -1) {
                    return -1;
                }
                else {
                    flg[select] = 1;
                    return select;
                }
            }
            else {
                for (let i = 0; i < queue.length; i++) {
                    if (burst[queue[i]] != 0 && min > arrival_process[i][1]) {
                        min = arrival_process[i][1];
                        select = queue[i];
                    }
                }
                //console.log();
                if (min == 1e18 && flag == n) {
                    return -2;
                }
                else if (select == -1) {
                    return -1;
                }
                else {
                    return select;
                }
            }
        }
    }

    function remove(array,n){
        var index=n;
        if(index > -1){
            array.splice(index,1);
        }
        return array;
    }

    function select_process_IO(cur,arrival_sort)
    {
        let n=lst;
        let min=1e18;
        let select=-1;
        let first=[];
        let j=0;
        if(arrival_sort.length==0)
        {
            return -2;   
        }
        for (let i = 0; (i < arrival_sort.length) && (arrival_sort[i][0]<=cur) ; i++) {
            if (min > arrival_sort[i][1]) {
                min=arrival_sort[i][1];
                j = i;
            }
        }
        console.log("j for=",j);
        if(j!=0 ){
            first[0] = arrival_sort[j];
        }
        else{
            first[0]=arrival_sort[0];
        }
        if(first[0][0]>cur)
        {
            return -1;
        }
        else
        {
            if(check==true)
                arrival_sort = remove(arrival_sort, j);
            let ind=first[0][2];
            console.log("ind=",ind);
            if(check==true){
                let burst_cur=burst[ind][0];
                if(burst[ind].length>1){
                    arrival_sort.push([(cur+burst_cur+burst[ind][1]),first[0][1],first[0][2]]);
                }
                burst[ind].shift();
                burst[ind].shift();
                first[0][0]=burst_cur;
            }
            else{
                burst[ind][0]=burst[ind][0]-1;
                if(burst[ind][0]==0){
                    arrival_sort = remove(arrival_sort, j);
                    if(burst[ind].length>1){
                        arrival_sort.push([(cur+1+burst[ind][1]),first[0][1],first[0][2]]);
                    }
                    burst[ind].shift();
                    burst[ind].shift();
                }
            }
            select=first;
        }
        return select;
    }

    function fun_IO_animation()
    {
        let n = lst;
        //var arrival_sort = new PriorityQueue({ comparator: function(a, b) { return a[0] - b[0]; }});
        let last = 0;
        let i = -1;
        let j;
        /*for(let i=0;i<arrival_sort.length;i++)
        {
            //we have pushed the (arrival_index,arrval_time) when it enters in the ready queue;
            arrival_sort[i]=arrival_sort[i];
        }
        console.log("r_q=",arrival_sort);*/
        while (1) {
            j=select_process_IO(last,arrival_sort);
            console.log("j=",j);
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
                let next_arrive=arrival_sort[0][0];
                let cur = 50 * (next_arrive - last);
                $(".animation").eq(i).animate({
                    width: cur
                }, 500);
                last = next_arrive;
                continue;
            }
            let cur
            if(check==true)
                cur = 50 * j[0][0];
            else
                cur = 50 * 1;
            i++;
            $("#animateAll").append(s_animate);
            $(".animation").eq(i).css("visibility", "visible");
            $(".animation").eq(i).text("P" + j[0][2]);
            $(".start").eq(i).text(last);

            if (i % 2)
                $(".animation").eq(i).css("background-color", "lightblue");
            else
                $(".animation").eq(i).css("background-color", "red");

            $(".animation").eq(i).animate({
                width: cur
            }, 1000);
            if(check==true){
                last = last + j[0][0];
                if(burst[j[0][2]].length==0)
                    Completion[j[0][2]]=last;
            }
            else{
                last = last + 1;
                if(burst[j[0][2]].length==0)
                    Completion[j[0][2]]=last;
            }
        }
        i++;
        $("#animateAll").append(s_animate);
        $(".start").eq(i).text(last);
    }

    function afterWaste() {
        let n = lst;
        for (let i = 0; i < n; i++) {
            if (flg[arrival_process[i][3]] == 0)
                return arrival_process[i][0];
        }
    }

    //Animation function
    function fun_animation() {
        let n = lst;

        let last = 0;
        let i = -1;
        let j;
        if (check == false) { flag = 0; }
        while (1) {
            if (check == false) { addQueue(last); }
            j = select_process(last);
            console.log("j=", j);
            //console.log(j);
            //console.log(last);
            if (j == -2) {
                break;
            }
            else if (j == -1) {
                i++;
                let next_arrive;
                $("#animateAll").append(s_animate);
                $(".animation").eq(i).css("visibility", "visible");
                $(".animation").eq(i).text("Waste");
                $(".animation").eq(i).css("background-color", "black");
                $(".animation").eq(i).css("color", "white");
                $(".start").eq(i).text(last);
                if (check == true) { next_arrive = afterWaste(); }
                else { next_arrive = arrival_process[flag][0]; }
                let cur = 50 * (next_arrive - last);
                $(".animation").eq(i).animate({
                    width: cur
                }, 500);
                last = next_arrive;
                continue;
            }
            let cur = 50;
            if (check == true) { cur = cur * burst[j]; }
            else {
                if (flag == n) {
                    cur = cur * burst[j];
                }
            }
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
            if (check == true) {
                last = last + burst[j];
                Completion[j] = last;
            }
            else {
                if (flag == n) {
                    last = last + burst[j];
                    burst[j] = 0;
                }
                else {
                    last = last + 1;
                    burst[j] = burst[j] - 1;
                }
                if (burst[j] == 0)
                    Completion[j] = last;
            }
        }
        i++;
        $("#animateAll").append(s_animate);
        $(".start").eq(i).text(last);
    }

    //algorithm
    $("#compute").click(function () {
        let n = lst;
        if (check2 == false) {
            let texts = $("#data .cen").map(function () {
                return $(this).val();
            }).get();
            console.log(texts);
            makeAnimationHide();
            arrival.length = 0;
            burst.length = 0;
            arrival_process.length = 0;
            queue.length = 0;
            fin_burst.length = 0;

            for (let i = 0; i < texts.length; i++) {
                if (i % 4 == 0)
                    continue;
                else if (i % 4 == 1) {
                    if (texts[i] == "") {
                        alert("Enter number");
                        makeHide();
                        return;
                    }
                    arrival.push(parseInt(texts[i]));
                    if (check == true) {
                        arrival_process.push([parseInt(texts[i]), parseInt(texts[i + 1]), parseInt(texts[i + 2]), parseInt(arrival_process.length)]);
                        flg.push(0);
                    }
                    else {
                        arrival_process.push([parseInt(texts[i]), parseInt(texts[i + 1]), parseInt(arrival_process.length)]);
                    }
                }
                else if (i % 4 == 3) {
                    if (texts[i] == "") {
                        alert("Enter number");
                        makeHide();
                        return;
                    }
                    burst.push(parseInt(texts[i]));
                    fin_burst.push(parseInt(texts[i]));
                }
            }
        }
        else{
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
                if (i % 5 == 0)
                    continue;
                else if (i % 5 == 1) {
                    if (texts[i] == "") {
                        alert("Enter number");
                        makeHide();
                        return;
                    }
                IO_time.push(parseInt(texts[i]));
                }
                else if(i%5==2){
                    if (texts[i] == "") {
                        alert("Enter number");
                        makeHide();
                        return;
                    }
                    arrival.push(parseInt(texts[i]));
                    arrival_sort.push([parseInt(texts[i]),parseInt(texts[i+1]),arrival_sort.length]);
                }
                else if(i%5==4)
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
                    console.log("array",array);
                    burst.push(array);
                    total_Burst.push(b);
                }
            }
        }

        // console.log(process);
        console.log(arrival);
        console.log(burst);
        console.log(arrival_process);
        console.log(arrival_sort);
        Completion.length = n;
        wt.length = n;
        tat.length = n;
        if(check2==false)
            arrival_process = arrival_process.sort(function (a, b) { return a[0] - b[0]; });
        else
            arrival_sort = arrival_sort.sort(function (a, b) { return a[0] - b[0]; });
            //compute Completion time
        // for(let i=0;i<arrival_burst.length;i++)
        // {
        //      console.log(arrival_burst[i][0]+" "+arrival_burst[i][1]);
        // }
        if(check2==false)
            fun_animation();
        else
            fun_IO_animation();

        let count = 0;
        //compute Turn Around Time and Waiting Time
        if(check2==false){
            while (count < n) {
                // console.log(Completion[count]);
                tat[count] = Completion[count] - arrival[count];
                // console.log(fin_burst);
                wt[count] = tat[count] - fin_burst[count];
                count++;
            }
        }
        else{
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
        var avg_tat = 0, avg_wat = 0;
        if(check2==false){
            for (let i = 0, j = 0; i < 3 * n; i += 3, j++) {
                $("#data .ans").eq(i).text(Completion[j]);
                $("#data .ans").eq(i + 1).text(tat[j]);
                $("#data .ans").eq(i + 2).text(wt[j]);
                avg_tat += tat[j];
                avg_wat += wt[j];
            }
        }
        else{
            for(let i = 0, j = 0; i < 3 * n; i += 3, j++) {
                $("#data_IO .ans").eq(i).text(Completion[j]);
                $("#data_IO .ans").eq(i + 1).text(tat[j]);
                $("#data_IO .ans").eq(i + 2).text(wt[j]);
                avg_tat+=tat[j];
                avg_wat+=wt[j];
            }
        }

        $("#avg_tat").text(Math.round(avg_tat / n * 100) / 100);
        $("#avg_wat").text(Math.round(avg_wat / n * 100) / 100);

        makeVisible();

    });

    function makeAnimationHide() {
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
