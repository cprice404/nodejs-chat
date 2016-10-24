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
        "total": "26",
        "ok": "26",
        "ko": "-"
    },
    "maxResponseTime": {
        "total": "4145",
        "ok": "4145",
        "ko": "-"
    },
    "meanResponseTime": {
        "total": "1004",
        "ok": "1004",
        "ko": "-"
    },
    "standardDeviation": {
        "total": "416",
        "ok": "416",
        "ko": "-"
    },
    "percentiles1": {
        "total": "988",
        "ok": "988",
        "ko": "-"
    },
    "percentiles2": {
        "total": "1205",
        "ok": "1205",
        "ko": "-"
    },
    "percentiles3": {
        "total": "1635",
        "ok": "1634",
        "ko": "-"
    },
    "percentiles4": {
        "total": "2229",
        "ok": "2229",
        "ko": "-"
    },
    "group1": {
        "name": "t < 800 ms",
        "count": 8143,
        "percentage": 27
    },
    "group2": {
        "name": "800 ms < t < 1200 ms",
        "count": 14240,
        "percentage": 47
    },
    "group3": {
        "name": "t > 1200 ms",
        "count": 7617,
        "percentage": 25
    },
    "group4": {
        "name": "failed",
        "count": 0,
        "percentage": 0
    },
    "meanNumberOfRequestsPerSecond": {
        "total": "857.143",
        "ok": "857.143",
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
        "total": "26",
        "ok": "26",
        "ko": "-"
    },
    "maxResponseTime": {
        "total": "4145",
        "ok": "4145",
        "ko": "-"
    },
    "meanResponseTime": {
        "total": "1004",
        "ok": "1004",
        "ko": "-"
    },
    "standardDeviation": {
        "total": "416",
        "ok": "416",
        "ko": "-"
    },
    "percentiles1": {
        "total": "988",
        "ok": "988",
        "ko": "-"
    },
    "percentiles2": {
        "total": "1205",
        "ok": "1205",
        "ko": "-"
    },
    "percentiles3": {
        "total": "1634",
        "ok": "1635",
        "ko": "-"
    },
    "percentiles4": {
        "total": "2229",
        "ok": "2229",
        "ko": "-"
    },
    "group1": {
        "name": "t < 800 ms",
        "count": 8143,
        "percentage": 27
    },
    "group2": {
        "name": "800 ms < t < 1200 ms",
        "count": 14240,
        "percentage": 47
    },
    "group3": {
        "name": "t > 1200 ms",
        "count": 7617,
        "percentage": 25
    },
    "group4": {
        "name": "failed",
        "count": 0,
        "percentage": 0
    },
    "meanNumberOfRequestsPerSecond": {
        "total": "857.143",
        "ok": "857.143",
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
