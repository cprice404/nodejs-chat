var stats = {
    type: "GROUP",
name: "Global Information",
path: "",
pathFormatted: "group_missing-name-b06d1",
stats: {
    "name": "Global Information",
    "numberOfRequests": {
        "total": "30000",
        "ok": "30000",
        "ko": "0"
    },
    "minResponseTime": {
        "total": "124",
        "ok": "124",
        "ko": "-"
    },
    "maxResponseTime": {
        "total": "4944",
        "ok": "4944",
        "ko": "-"
    },
    "meanResponseTime": {
        "total": "1367",
        "ok": "1367",
        "ko": "-"
    },
    "standardDeviation": {
        "total": "350",
        "ok": "350",
        "ko": "-"
    },
    "percentiles1": {
        "total": "1302",
        "ok": "1302",
        "ko": "-"
    },
    "percentiles2": {
        "total": "1368",
        "ok": "1368",
        "ko": "-"
    },
    "percentiles3": {
        "total": "1884",
        "ok": "1884",
        "ko": "-"
    },
    "percentiles4": {
        "total": "2128",
        "ok": "2128",
        "ko": "-"
    },
    "group1": {
        "name": "t < 800 ms",
        "count": 433,
        "percentage": 1
    },
    "group2": {
        "name": "800 ms < t < 1200 ms",
        "count": 2150,
        "percentage": 7
    },
    "group3": {
        "name": "t > 1200 ms",
        "count": 27417,
        "percentage": 91
    },
    "group4": {
        "name": "failed",
        "count": 0,
        "percentage": 0
    },
    "meanNumberOfRequestsPerSecond": {
        "total": "697.674",
        "ok": "697.674",
        "ko": "-"
    }
},
contents: {
"req_index-6a992": {
        type: "REQUEST",
        name: "index",
path: "index",
pathFormatted: "req_index-6a992",
stats: {
    "name": "index",
    "numberOfRequests": {
        "total": "30000",
        "ok": "30000",
        "ko": "0"
    },
    "minResponseTime": {
        "total": "124",
        "ok": "124",
        "ko": "-"
    },
    "maxResponseTime": {
        "total": "4944",
        "ok": "4944",
        "ko": "-"
    },
    "meanResponseTime": {
        "total": "1367",
        "ok": "1367",
        "ko": "-"
    },
    "standardDeviation": {
        "total": "350",
        "ok": "350",
        "ko": "-"
    },
    "percentiles1": {
        "total": "1302",
        "ok": "1302",
        "ko": "-"
    },
    "percentiles2": {
        "total": "1368",
        "ok": "1368",
        "ko": "-"
    },
    "percentiles3": {
        "total": "1883",
        "ok": "1883",
        "ko": "-"
    },
    "percentiles4": {
        "total": "2128",
        "ok": "2128",
        "ko": "-"
    },
    "group1": {
        "name": "t < 800 ms",
        "count": 433,
        "percentage": 1
    },
    "group2": {
        "name": "800 ms < t < 1200 ms",
        "count": 2150,
        "percentage": 7
    },
    "group3": {
        "name": "t > 1200 ms",
        "count": 27417,
        "percentage": 91
    },
    "group4": {
        "name": "failed",
        "count": 0,
        "percentage": 0
    },
    "meanNumberOfRequestsPerSecond": {
        "total": "697.674",
        "ok": "697.674",
        "ko": "-"
    }
}
    }
}

}

function fillStats(stat){
    $("#numberOfRequests").append(stat.numberOfRequests.total);
    $("#numberOfRequestsOK").append(stat.numberOfRequests.ok);
    $("#numberOfRequestsKO").append(stat.numberOfRequests.ko);

    $("#minResponseTime").append(stat.minResponseTime.total);
    $("#minResponseTimeOK").append(stat.minResponseTime.ok);
    $("#minResponseTimeKO").append(stat.minResponseTime.ko);

    $("#maxResponseTime").append(stat.maxResponseTime.total);
    $("#maxResponseTimeOK").append(stat.maxResponseTime.ok);
    $("#maxResponseTimeKO").append(stat.maxResponseTime.ko);

    $("#meanResponseTime").append(stat.meanResponseTime.total);
    $("#meanResponseTimeOK").append(stat.meanResponseTime.ok);
    $("#meanResponseTimeKO").append(stat.meanResponseTime.ko);

    $("#standardDeviation").append(stat.standardDeviation.total);
    $("#standardDeviationOK").append(stat.standardDeviation.ok);
    $("#standardDeviationKO").append(stat.standardDeviation.ko);

    $("#percentiles1").append(stat.percentiles1.total);
    $("#percentiles1OK").append(stat.percentiles1.ok);
    $("#percentiles1KO").append(stat.percentiles1.ko);

    $("#percentiles2").append(stat.percentiles2.total);
    $("#percentiles2OK").append(stat.percentiles2.ok);
    $("#percentiles2KO").append(stat.percentiles2.ko);

    $("#percentiles3").append(stat.percentiles3.total);
    $("#percentiles3OK").append(stat.percentiles3.ok);
    $("#percentiles3KO").append(stat.percentiles3.ko);

    $("#percentiles4").append(stat.percentiles4.total);
    $("#percentiles4OK").append(stat.percentiles4.ok);
    $("#percentiles4KO").append(stat.percentiles4.ko);

    $("#meanNumberOfRequestsPerSecond").append(stat.meanNumberOfRequestsPerSecond.total);
    $("#meanNumberOfRequestsPerSecondOK").append(stat.meanNumberOfRequestsPerSecond.ok);
    $("#meanNumberOfRequestsPerSecondKO").append(stat.meanNumberOfRequestsPerSecond.ko);
}
