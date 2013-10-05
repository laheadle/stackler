
var st = []

var funs = {
    one: function () {
        st[st.length] = 1;
    },

    two: function () {
        st[st.length] = 2;
    },

    three: function () {
        st[st.length] = 3;
    },

    dup: function () {
        st[st.length] = st[st.length - 1]
    },

    drop: function () {
        st.pop()
    },

    swap: function () {
        var s2 = st[st.length - 2]
        st[st.length -2] = st[st.length - 1]
        st[st.length - 1] = s2
    },

    over: function () {
        st[st.length] = st[st.length - 2]
    },

    rot: function() {
        var t = st[st.length - 1]
        st[st.length - 1] = st[st.length - 3]
        st[st.length - 3] = st[st.length - 2]
        st[st.length - 2] = t
    },

    '-rot': function () {
        var t = st[st.length - 1]
        st[st.length - 1] = st[st.length - 2]
        st[st.length - 2] = st[st.length - 3]
        st[st.length - 3] = t
    },

    nip: function () {
        var t = st.pop()
        st.pop()
        st[st.length] = t
    },

    tuck: function () {
        var t0 = st.pop()
        var t1 = st.pop()
        st[st.length] = t0
        st[st.length] = t1
        st[st.length] = t0
    }

}

// minimum stack size required
var MIN_SIZE_INDEX = 0

// how many are added to the stack
var ADDED_INDEX = 1

var effects = {
    one: [0, 1],
    two: [0, 1],
    three: [0, 1],
    dup: [1, 1],
    drop: [1, -1],
    swap: [2, 0],
    nip: [2, -1],
    over: [2, 1],
    tuck: [2, 1],
    rot: [3, 0],
    '-rot': [3, 0]
}

var keys = []
for (p in effects) {
    if (effects.hasOwnProperty(p)) {
        keys[keys.length] = p;
    }
}

function find(n, test) {
    while(true) {
        for (var i = 0;i < keys.length;i++) {
            if (test(keys[i], effects[keys[i]])) {
                if (n == 0) {
                    return keys[i]
                }
                n--;
            }
        }
    }
}

function rand(max) {
    return Math.floor((Math.random()*max)) 
}

// returns { sequenceOfMoves: s, finalStack: f }
function generateSequence(maxStack, numOps) {
    st = []
    var size = 0
    var moves = []
    var found = '' // don't pick the same word twice in a row
    for (var i = 0;i < numOps;i++) {
        found = find(rand(keys.length),
                     function(key, val) {
                         return (found != key && val[MIN_SIZE_INDEX] <= size) &&
                             (val[ADDED_INDEX] + size) <= maxStack;

                     })
        moves[moves.length] = found
        size += effects[found][ADDED_INDEX]
    }

    for (var i = 0;i < moves.length;i++) {
        funs[moves[i]]();
    }

    return { sequenceOfMoves: moves, finalStack: st }
}

// http://caseyjustus.com/finding-the-median-of-an-array-with-javascript
function median(values) {
    values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

function getRecents() {
    if(typeof(Storage)==="undefined") return null
    var str = localStorage.recents
    if (str === undefined) return []
    return JSON.parse(str)
}

function saveRecents(recents) {
    localStorage.recents = JSON.stringify(recents)
}

var maxHistory = 5

function showMedian(secs) {
    var recents = getRecents()
    if (recents === null) return
    if (recents.length === maxHistory) {
        recents = recents.splice(1)
    }
    recents[recents.length] = secs
    $('#recentSummary').show()
    $('#numRecents').text(recents.length)
    $('#medianValue').text(median(recents))
    saveRecents(recents)
}

$(function() {
    function stringify(arr) {
        return _.reduce(arr, function(a,b){return String(a)+' '+String(b)}, '')
    }
    
    var started = new Date();
    var generated = generateSequence(4, 8 + rand(7))
    var seq = stringify(generated.sequenceOfMoves);
    var finalStack = stringify(generated.finalStack);
    $('#seq').text(seq)
    $('#finalStack').text(finalStack);
    $('#show').click(function() { 
        $('#finalStack').show()
        var secs = Math.round((new Date() - started) / 100) / 10
        showMedian(secs)
        $('#secs').text(secs)
        $('#timing').show()
    });

})
