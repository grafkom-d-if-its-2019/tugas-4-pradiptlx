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
        membesar = 1, thetaSpeed = 0.0;
    var axis = [true, true, true];
    var x = 0;
    var y = 1;
    var z = 2;

    var moving = [0.0, 0.0, 0.0];
    var xAdd = 0.02;
    var yAdd = 0.003;
    var zAdd = 0.004;
    var lineVertices, cubeVertices, cubePoints, cubeColors, cubeVertices, cubeNormals, textureCoordinates;
    var mm, mmLoc, vm, vmLoc, pm, camera, dc, dcLoc, dd, ddLoc, ac, acLoc, nm, nmLoc;

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
            // Membuat vertex buffer object (CPU Memory <==> GPU Memory)
            var vertexBufferObject = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);

            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            vPosition = gl.getAttribLocation(program, 'vPosition');
            vColor = gl.getAttribLocation(program, 'vColor');

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

            // Tell WebGL we want to affect texture unit 0
            gl.activeTexture(gl.TEXTURE0);

            // Uniform untuk tekstur
            var sampler0Loc = gl.getUniformLocation(program2, 'sampler0');
            gl.uniform1i(sampler0Loc, 0);

            // Create a texture.
            var texture = gl.createTexture();

            // Asynchronously load an image
            var image = new Image();
            const level = 0;
            const internalFormat = gl.RGBA;
            const srcFormat = gl.RGBA;
            const srcType = gl.UNSIGNED_BYTE;
            image.src = "images/txStainglass.bmp";
            image.addEventListener('load', function () {
                // Now that the image has loaded make copy it to the texture.
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, border = image);
                gl.generateMipmap(gl.TEXTURE_2D);
            });


            var vPosition, vColor;
            
            // Texture
            // const textureCoordBuffer = gl.createBuffer();
            // gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

            // Cube
            var vertexBufferObjectCube = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObjectCube);

            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
            //     gl.STATIC_DRAW);

            vPosition = gl.getAttribLocation(program2, 'vPosition');

            // Cube
            var vNormal = gl.getAttribLocation(program2, 'vNormal');
            var vTexCoord = gl.getAttribLocation(program2, 'vTexCoord');

            gl.vertexAttribPointer(
                vPosition,    // variabel yang memegang posisi attribute di shader
                3,            // jumlah elemen per atribut
                gl.FLOAT,     // tipe data atribut
                gl.FALSE,
                11 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks (overall) 
                0                                   // offset dari posisi elemen di array
            );
            gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, gl.FALSE,
                11 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
            gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, gl.FALSE,
                11 * Float32Array.BYTES_PER_ELEMENT, 9 * Float32Array.BYTES_PER_ELEMENT);
            
            gl.enableVertexAttribArray(vPosition);
            // gl.enableVertexAttribArray(vColor);
            gl.enableVertexAttribArray(vNormal);
            gl.enableVertexAttribArray(vTexCoord);

            mmLoc = gl.getUniformLocation(program2, 'modelMatrix');
            mm = glMatrix.mat4.create();
            glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);

            // Definisi untuk matrix view dan projection
            vmLoc = gl.getUniformLocation(program2, 'viewMatrix');
            vm = glMatrix.mat4.create();
            pmLoc = gl.getUniformLocation(program2, 'projectionMatrix');
            pm = glMatrix.mat4.create();
            camera = { x: 0.0, y: 0.0, z: 0.0 };
            glMatrix.mat4.perspective(pm,
                glMatrix.glMatrix.toRadian(90), // fovy dalam radian
                canvas.width / canvas.height,     // aspect ratio
                0.5,  // near
                10.0, // far
            );
            gl.uniformMatrix4fv(pmLoc, false, pm);

            // Uniform untuk pencahayaan
            dcLoc = gl.getUniformLocation(program2, 'diffuseColor');
            dc = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);  // rgb
            gl.uniform3fv(dcLoc, dc);
            ddLoc = gl.getUniformLocation(program2, 'diffusePosition');
            dd = glMatrix.vec3.fromValues(1., 2., 1.7);  // xyz
            gl.uniform3fv(ddLoc, dd);
            acLoc = gl.getUniformLocation(program2, 'ambientColor');
            ac = glMatrix.vec3.fromValues(0.2, 0.2, 0.2);
            gl.uniform3fv(acLoc, ac);

            // Uniform untuk modelMatrix vektor normal
            nmLoc = gl.getUniformLocation(program2, 'normalMatrix');
        }

        if (vPosition < 0) {
            console.log('Failed to get the storage location of vPosition');
            return -1;
        }
    }

    function render() {
        // renderer info
        // gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // gl.useProgram(program);
        // initBuffers(new Float32Array(lineVertices), 'line');

        // scaleLoc = gl.getUniformLocation(program, 'scale');
        // sudutLoc = gl.getUniformLocation(program, 'theta');
        // drawFont();

        // Cube
        // gl.useProgram(program2);
        // initBuffers(new Float32Array(cubeVertices), 'cube');
        drawCube();

        requestAnimationFrame(render);
    }

    function quad(a, b, c, d) {
        var indices = [a, b, c, a, c, d];
        for (var i = 0; i < indices.length; i++) {
            for (var j = 0; j < 3; j++) {
                cubeVertices.push(cubePoints[indices[i]][j]);
            }
            for (var j = 0; j < 3; j++) {
                cubeVertices.push(cubeColors[a][j]);
            }
            for (var j = 0; j < 3; j++) {
                cubeVertices.push(cubeNormals[a][j]);
            }
            switch (indices[i]) {
                case a:
                    cubeVertices.push(0.0);
                    cubeVertices.push(0.0);
                    break;
                case b:
                    cubeVertices.push(0.0);
                    cubeVertices.push(1.0);
                    break;
                case c:
                    cubeVertices.push(1.0);
                    cubeVertices.push(1.0);
                    break;
                case d:
                    cubeVertices.push(1.0);
                    cubeVertices.push(0.0);
                    break;

                default:
                    break;
            }
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
        cubeNormals = [
            [],
            [0.0, 0.0, 1.0], // depan
            [1.0, 0.0, 0.0], // kanan
            [0.0, -1.0, 0.0], // bawah
            [0.0, 0.0, -1.0], // belakang
            [-1.0, 0.0, 0.0], // kiri
            [0.0, 1.0, 0.0], // atas
            []
        ];
        // textureCoordinates = [
        //     // Front
        //     0.0, 0.0,
        //     1.0, 0.0,
        //     1.0, 1.0,
        //     0.0, 1.0,
        //     // Back
        //     0.0, 0.0,
        //     1.0, 0.0,
        //     1.0, 1.0,
        //     0.0, 1.0,
        //     // Top
        //     0.0, 0.0,
        //     1.0, 0.0,
        //     1.0, 1.0,
        //     0.0, 1.0,
        //     // Bottom
        //     0.0, 0.0,
        //     1.0, 0.0,
        //     1.0, 1.0,
        //     0.0, 1.0,
        //     // Right
        //     0.0, 0.0,
        //     1.0, 0.0,
        //     1.0, 1.0,
        //     0.0, 1.0,
        //     // Left
        //     0.0, 0.0,
        //     1.0, 0.0,
        //     1.0, 1.0,
        //     0.0, 1.0,
        // ];

        // quad(1, 0, 3, 2);
        quad(2, 3, 7, 6);
        quad(3, 0, 4, 7);
        quad(4, 5, 6, 7);
        quad(5, 4, 0, 1);
        quad(6, 5, 1, 2);

        console.log(cubeVertices);
        console.log(cubePoints[2][0]);

        // Font
        // gl.useProgram(program);
        // initBuffers(new Float32Array(lineVertices), 'line');

        gl.useProgram(program2);
        initBuffers(new Float32Array(cubeVertices), 'cube');
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

        theta += thetaSpeed;
        if (axis[z]) glMatrix.mat4.rotateZ(mm, mm, thetaSpeed / 2);
        if (axis[y]) glMatrix.mat4.rotateY(mm, mm, thetaSpeed / 2);
        if (axis[x]) glMatrix.mat4.rotateX(mm, mm, thetaSpeed / 2);
        gl.uniformMatrix4fv(mmLoc, false, mm);

        // Perhitungan modelMatrix untuk vektor normal
        nm = glMatrix.mat3.create();
        glMatrix.mat3.normalFromMat4(nm, mm);
        gl.uniformMatrix3fv(nmLoc, false, nm);

        glMatrix.mat4.lookAt(vm,
            [camera.x, camera.y, camera.z], // di mana posisi kamera (posisi)
            [0.0, 0.0, -2.0], // ke mana kamera menghadap (vektor)
            [0.0, 1.0, 0.0]  // ke mana arah atas kamera (vektor)
        );
        gl.uniformMatrix4fv(vmLoc, false, vm);

        gl.drawArrays(gl.TRIANGLES, 0, 30);
    }

    // Kontrol menggunakan keyboard
    function onKeyDown(event) {
        if (event.keyCode == 173) thetaSpeed -= 0.01;       // key '-'
        else if (event.keyCode == 61) thetaSpeed += 0.01;  // key '='
        else if (event.keyCode == 48) thetaSpeed = 0;       // key '0'
        if (event.keyCode == 88) axis[x] = !axis[x];
        if (event.keyCode == 89) axis[y] = !axis[y];
        if (event.keyCode == 90) axis[z] = !axis[z];
        if (event.keyCode == 38) camera.z -= 0.1;
        else if (event.keyCode == 40) camera.z += 0.1;
        if (event.keyCode == 37) camera.x -= 0.1;
        else if (event.keyCode == 39) camera.x += 0.1;

    }
    document.addEventListener('keydown', onKeyDown);

    // Kontrol menggunakan mouse
    var dragging, lastx, lasty;
    function onMouseDown(event) {
        var x = event.clientX;
        var y = event.clientY;
        var rect = event.target.getBoundingClientRect();
        // Saat mouse diklik di area aktif browser,
        //  maka flag dragging akan diaktifkan
        if (
            rect.left <= x &&
            rect.right > x &&
            rect.top <= y &&
            rect.bottom > y
        ) {
            dragging = true;
            lastx = x;
            lasty = y;
        }
    }
    function onMouseUp(event) {
        // Ketika klik kiri mouse dilepas
        dragging = false;
    }
    function onMouseMove(event) {
        var x = event.clientX;
        var y = event.clientY;
        if (dragging) {
            var factor = 10 / canvas.height;
            var dx = factor * (x - lastx);
            var dy = factor * (y - lasty);
            // Menggunakan dx dan dy untuk memutar kubus
            glMatrix.mat4.rotateY(mm, mm, dx);
            glMatrix.mat4.rotateX(mm, mm, dy);
        }
        lastx = x;
        lasty = y;
    }

    function main() {

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('resize', resizer);
        canvas = document.getElementById("glcanvas");
        gl = glUtils.checkWebGL(canvas);
        initGlSize();

        var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
        var vertexShader2 = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex);
        var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
        var fragmentShader2 = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);

        program = glUtils.createProgram(gl, vertexShader, fragmentShader);
        program2 = glUtils.createProgram(gl, vertexShader2, fragmentShader2);

        drawA();
        // requestAnimationFrame(draw);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        resizer();

    }
})();