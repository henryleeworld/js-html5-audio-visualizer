window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

var start = function() {
    var audio = document.getElementById('audio');
    var ctx = new AudioContext();
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(audio);
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    var canvas = document.getElementById('canvas'),
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        meterWidth = 5,
        gap = 1,
        capHeight = 2,
        capStyle = 'red',
        meterNum = 800 / (10 + 2),
        capYPositionArray = [];
    ctx = canvas.getContext('2d'),
        gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, 'red');
    gradient.addColorStop(0.5, 'blue');
    gradient.addColorStop(0, '#f00');

    function renderFrame() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var step = Math.round(array.length / meterNum);
        ctx.clearRect(0, 0, cwidth, cheight);
        for (var i = 0; i < meterNum; i++) {
            var value = array[i * step];
            if (capYPositionArray.length < Math.round(meterNum)) {
                capYPositionArray.push(value);
            };
            ctx.fillStyle = capStyle;

            if (value < capYPositionArray[i]) {
                ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
            } else {
                ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                capYPositionArray[i] = value;
            };
            ctx.fillStyle = gradient;
            ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight);
        }
        requestAnimationFrame(renderFrame);
    }
    renderFrame();

};

audio.onplay = function() {
    start();
}