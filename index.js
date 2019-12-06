(function () {
    /** @type {HTMLCanvasElement} */

    glUtils.SL.init({
        callback: function () {
            main();
        }
    });

    var canvas, gl, program, program2;
    var theta = 0,
        thetaLoc, move, sudutLoc, scaleLoc, scale = 1,
        membesar = 1, n;
    
    var moving = [0.0, 0.0, 0.0];
    var xAdd = 0.02;
    var yAdd = 0.003;
    var zAdd = 0.004;
    var lineVertices, cubeVertices, cubePoints, cubeColors, cubeVertices;

    function resizer() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    function initGlSize() {
        var width = canvas.getAttribute("width"),
            height = canvas.getAttribute("height");
        // Fullscreen if not set
        if (width) {
            gl.maxWidth = width;
        }
        if (height) {
            gl.maxHeight = height;
        }
    }

    function initBuffers(vertices, shape) {
        if (shape == 'line') {
            var vPosition, vColor;
            // var vTexCoord, vNormal;
            // Membuat vertex buffer object (CPU Memory <==> GPU Memory)
            var vertexBufferObject = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);

            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            vPosition = gl.getAttribLocation(program, 'vPosition');
            vColor = gl.getAttribLocation(program, 'vColor');
            // vNormal = gl.getAttribLocation(program, 'vNormal');
            // vTexCoord = gl.getAttribLocation(program, 'vTexCoord');

            gl.vertexAttribPointer(
                vPosition, // variabel yang memegang posisi attribute di shader
                3, // jumlah elemen per atribut
                gl.FLOAT, // tipe data atribut
                gl.FALSE,
                6 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks (overall) 
                0 // offset dari posisi elemen di array
            );
            gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE,
                6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

            gl.enableVertexAttribArray(vPosition);
            gl.enableVertexAttribArray(vColor);
        } else if (shape == 'cube') {
            var vPosition, vColor;
            var vertexBufferObjectCube = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObjectCube);

            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            vPosition = gl.getAttribLocation(program2, 'vPosition');
            // vColor = gl.getAttribLocation(program2, 'vColor');
            var vNormalCube = gl.getAttribLocation(program2, 'vNormalCube');
            var vTexCoordCube = gl.getAttribLocation(program2, 'vTexCoordCube');

            // Cube
            gl.vertexAttribPointer(
                vPosition, // variabel yang memegang posisi attribute di shader
                3, // jumlah elemen per atribut
                gl.FLOAT, // tipe data atribut
                gl.FALSE,
                6 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks (overall) 
                0 // offset dari posisi elemen di array
            );
            // gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE,
            //     6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
            gl.vertexAttribPointer(vNormalCube, 3, gl.FLOAT, gl.FALSE,
                11 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
            gl.vertexAttribPointer(vTexCoordCube, 2, gl.FLOAT, gl.FALSE,
                11 * Float32Array.BYTES_PER_ELEMENT, 9 * Float32Array.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(vPosition);
            // gl.enableVertexAttribArray(vColor);
            gl.enableVertexAttribArray(vNormalCube);
            gl.enableVertexAttribArray(vTexCoordCube);
        }

        if (vPosition < 0) {
            console.log('Failed to get the storage location of vPosition');
            return -1;
        }
    }

    function render() {
        // renderer info
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);
        initBuffers(new Float32Array(lineVertices), 'line');

        scaleLoc = gl.getUniformLocation(program, 'scale');
        // sudutLoc = gl.getUniformLocation(program, 'theta');
        drawFont();

        // Cube
        gl.useProgram(program2);
        initBuffers(new Float32Array(cubeVertices), 'cube');
        drawCube();

        requestAnimationFrame(render);
    }

    function quad(a, b, c, d) {
        var indices = [a, b, b, c, c, d, d, a];
        for (var i = 0; i < indices.length; i++) {
            for (var j = 0; j < 3; j++) {
                cubeVertices.push(cubePoints[indices[i]][j]);
            }
            for (var j = 0; j < 3; j++) {
                cubeVertices.push(cubeColors[a][j]);
            }
            // for (var j = 0; j < 3; j++) {
            //     cubeVertices.pus[a][j]);
            // }
        }
    }

    function drawA() {
        lineVertices = [
            -.58, +0.4, 0.0, 0.0, 1.0, 1.0,
            -.22, +0.4, 0.0, 1.0, 1.0, 0.0,

            -.58, +0.4, 0.0, 0.0, 1.0, 1.0,
            -.58, -.4, 0.0, 1.0, 1.0, 0.0,

            -.22, +.4, 0.0, 1.0, 1.0, 0.0,
            -.22, +.3, 0.0, 1.0, 1.0, 0.0,

            -.5, +.3, 0.0, 1.0, 1.0, 0.0,
            -.22, +.3, 0.0, 1.0, 0.0, 0.0,

            -.5, +.3, 0.0, 1.0, 1.0, 0.0,
            -.5, +.14, 0.0, 1.0, 0.0, 0.0,

            -.5, +.14, 0.0, 1.0, 1.0, 0.0,
            -.22, +.14, 0.0, 1.0, 0.0, 0.0,

            -.22, +.14, 0.0, 1.0, 1.0, 0.0,
            -.22, +.04, 0.0, 1.0, 0.0, 1.0,

            -.5, +.14, 0.0, 1.0, 1.0, 0.0,
            -.22, +.14, 0.0, 0.0, 1.0, 1.0,

            -.5, +.04, 0.0, 1.0, 1.0, 0.0,
            -.22, +.04, 0.0, 0.0, 1.0, 1.0,

            -.5, +.04, 0.0, 1.0, 1.0, 0.0,
            -.5, -.46, 0.0, 0.0, 1.0, 1.0,
        ];

        cubeVertices = [];

        cubePoints = [
            [-0.5, -0.5, 0.5],
            [-0.5, 0.5, 0.5],
            [0.5, 0.5, 0.5],
            [0.5, -0.5, 0.5],
            [-0.5, -0.5, -0.5],
            [-0.5, 0.5, -0.5],
            [0.5, 0.5, -0.5],
            [0.5, -0.5, -0.5],
        ];
        cubeColors = [
            [],
            [1.0, 0.0, 0.0], // merah
            [0.0, 1.0, 0.0], // hijau
            [0.0, 0.0, 1.0], // biru
            [1.0, 1.0, 1.0], // putih
            [1.0, 0.5, 0.0], // oranye
            [1.0, 1.0, 0.0], // kuning
            []
        ];

        var cubeNormals = [
            [],
            [0.0, 0.0, 1.0], // depan
            [1.0, 0.0, 0.0], // kanan
            [0.0, -1.0, 0.0], // bawah
            [0.0, 0.0, -1.0], // belakang
            [-1.0, 0.0, 0.0], // kiri
            [0.0, 1.0, 0.0], // atas
            []
        ];

        quad(1, 0, 3, 2);
        quad(2, 3, 7, 6);
        quad(3, 0, 4, 7);
        quad(4, 5, 6, 7);
        quad(5, 4, 0, 1);
        quad(6, 5, 1, 2);

        // console.log(cubeVertices);

        // var newVertices = new Float32Array(cubeVertices.concat(lineVertices))
        
        render();
    }

    function drawFont() {
        move = gl.getUniformLocation(program, 'bounce');
        if (moving[0] + (-0.45) < (-0.5 * 1.5) || moving[0] + (-0.05) > (0.5 * 1.5)) {
            xAdd *= -1;
        }

        moving[0] += xAdd;

        var middle_point = -0.3 + moving[0];
        var tengah = gl.getUniformLocation(program, 'center');

        gl.uniform1f(tengah, middle_point);
        if (moving[1] + (-0.5) < (-0.5 * 1.5) || moving[1] + 0.6 > (0.5 * 1.5)) {
            yAdd *= -1;
        }

        moving[1] += yAdd;

        if (moving[2] < (-0.5 * 1.5) || moving[2] > (0.5 * 1.5)) {
            zAdd *= -1;
        }

        moving[2] += zAdd;

        gl.uniform3fv(move, moving);

        if (scale >= 1) membesar = -1;
        else if (scale <= -1) membesar = 1;
        scale = scale + (membesar * 0.0119);
        gl.uniform1f(scaleLoc, scale);
        // Definisi untuk matrix view dan projection
        var vmLoc = gl.getUniformLocation(program, 'viewMatrix');
        var vm = glMatrix.mat4.create();
        var pmLoc = gl.getUniformLocation(program, 'projectionMatrix');
        var pm = glMatrix.mat4.create();
        var camera = {
            x: 0.0,
            y: 0.0,
            z: 0.0
        };
        glMatrix.mat4.lookAt(vm,
            glMatrix.vec3.fromValues(0.0, 0.0, 0.0),  //posisi kamera
            glMatrix.vec3.fromValues(0.0, 0.0, -2.0), //titik lihat
            glMatrix.vec3.fromValues(0.0, 1.0, 0.0),  //arah atas kamera
        );
        glMatrix.mat4.perspective(pm,
            glMatrix.glMatrix.toRadian(90), // fovy dalam radian
            canvas.width / canvas.height, // aspect ratio
            0.5, // near
            10.0, // far
        );
        gl.uniformMatrix4fv(vmLoc, false, vm);
        gl.uniformMatrix4fv(pmLoc, false, pm);

        gl.drawArrays(gl.LINES, 0, lineVertices.length / 6);
    }

    function drawCube() {
        // Definisi untuk matrix view dan projection
        var vmLoc = gl.getUniformLocation(program2, 'viewMatrix');
        var vm = glMatrix.mat4.create();
        var pmLoc = gl.getUniformLocation(program2, 'projectionMatrix');
        var pm = glMatrix.mat4.create();
        glMatrix.mat4.lookAt(vm,
            glMatrix.vec3.fromValues(0.0, 0.0, 0.0),  //posisi kamera
            glMatrix.vec3.fromValues(0.0, 0.0, -2.0), //titik lihat
            glMatrix.vec3.fromValues(0.0, 1.0, 0.0),  //arah atas kamera
        );
        glMatrix.mat4.perspective(pm,
            glMatrix.glMatrix.toRadian(90), // fovy dalam radian
            canvas.width / canvas.height, // aspect ratio
            0.5, // near
            10.0, // far
        );
        gl.uniformMatrix4fv(vmLoc, false, vm);
        gl.uniformMatrix4fv(pmLoc, false, pm);

        gl.drawArrays(gl.LINES, 0, cubeVertices.length / 6);
    }

    function main() {
        window.addEventListener('resize', resizer);
        canvas = document.getElementById("glcanvas");
        gl = glUtils.checkWebGL(canvas);
        initGlSize();

        var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
        var vertexShader2 = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex);
        var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
        var fragmentShader2 = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);

        program = glUtils.createProgram(gl, vertexShader, fragmentShader);
        program2 = glUtils.createProgram(gl, vertexShader2, fragmentShader2);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        resizer();

        // Create texture
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));

        // Load image
        var image = new Image();
        image.src = 'images/txStaininglass.bmp';
        image.addEventListener('load', () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });

        drawA();
        // requestAnimationFrame(draw);
        
    }
})();