var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("Particle", ["require", "exports"], function (require, exports) {
    "use strict";
    var Particle = (function () {
        function Particle() {
            this.alive = true;
            this.color = vec3.fromValues(1, 1, 1);
            this.lifetime = 0;
            this.orientation = quat.create();
            this.position = vec3.create();
            this.radius = 1;
            this.velocity = vec3.create();
        }
        return Particle;
    }());
    exports.__esModule = true;
    exports["default"] = Particle;
});
define("ParticleSystem", ["require", "exports"], function (require, exports) {
    "use strict";
    var ParticleSystem = (function () {
        function ParticleSystem() {
            this.particles = [];
            this.renderers = [];
            this.operators = [];
            this.initializers = [];
            this.emitters = [];
            this.forceGenerators = [];
            this.constraints = [];
            this.children = [];
        }
        ParticleSystem.prototype.start = function () {
            this.particles = [];
            this.resetControllers();
            for (var _i = 0, _a = this.emitters; _i < _a.length; _i++) {
                var emitter = _a[_i];
                emitter.start();
            }
        };
        ParticleSystem.prototype.stop = function (endcap) {
            for (var _i = 0, _a = this.emitters; _i < _a.length; _i++) {
                var emitter = _a[_i];
                emitter.stop();
            }
            if (!endcap) {
                this.particles = [];
            }
        };
        ParticleSystem.prototype.restart = function () {
            this.stop(false);
            this.start();
        };
        ParticleSystem.prototype.resetControllers = function () {
            for (var _i = 0, _a = this.renderers; _i < _a.length; _i++) {
                var renderer = _a[_i];
                renderer.reset();
            }
            for (var _b = 0, _c = this.operators; _b < _c.length; _b++) {
                var operator = _c[_b];
                operator.reset();
            }
            for (var _d = 0, _e = this.initializers; _d < _e.length; _d++) {
                var initializer = _e[_d];
                initializer.reset();
            }
            for (var _f = 0, _g = this.emitters; _f < _g.length; _f++) {
                var emitter = _g[_f];
                emitter.reset();
            }
        };
        ParticleSystem.prototype.tick = function (frameTime) {
            if (frameTime !== 0) {
                for (var _i = 0, _a = this.operators; _i < _a.length; _i++) {
                    var operator = _a[_i];
                    operator.operate(this.particles, frameTime);
                }
                for (var _b = 0, _c = this.emitters; _b < _c.length; _b++) {
                    var emitter = _c[_b];
                    emitter.tick(frameTime);
                }
            }
        };
        ParticleSystem.prototype.render = function (gl, projectionMatrix, modelViewMatrix) {
            for (var _i = 0, _a = this.renderers; _i < _a.length; _i++) {
                var renderer = _a[_i];
                renderer.render(this.particles, projectionMatrix, modelViewMatrix);
            }
        };
        ParticleSystem.prototype.onParticleSpawn = function (particle) {
            this.particles.push(particle);
            for (var _i = 0, _a = this.initializers; _i < _a.length; _i++) {
                var initializer = _a[_i];
                initializer.initialize(particle);
            }
        };
        return ParticleSystem;
    }());
    exports.__esModule = true;
    exports["default"] = ParticleSystem;
});
define("RenderWindow", ["require", "exports"], function (require, exports) {
    "use strict";
    var RenderWindow = (function () {
        function RenderWindow(element) {
            this.width = 0;
            this.height = 0;
            this.canvas = element;
            this.gl = element.getContext("webgl");
            this.updateSize();
            window.addEventListener("resize", this.onResize.bind(this));
            this.initGL(this.gl);
            this.camera = new Camera();
            this.camera.updateProjection(this.width / this.height);
            this.ready = false;
            this.initBuffer(this.gl);
            ShaderManager.init(this.gl, (function () {
                this.ready = true;
            }).bind(this));
        }
        RenderWindow.prototype.onResize = function (event) {
            this.updateSize();
            this.camera.updateProjection(this.width / this.height);
        };
        RenderWindow.prototype.updateSize = function () {
            this.width = window.innerWidth - 600;
            this.height = window.innerHeight - 35;
            this.canvas.setAttribute("width", this.width.toString());
            this.canvas.setAttribute("height", this.height.toString());
        };
        RenderWindow.prototype.initBuffer = function (gl) {
            this.gridBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.gridBuffer);
            var vertices = [];
            for (var i = 0; i < 11; i++) {
                var j = i - 5;
                vertices = vertices.concat([j * 20, 100, 0, j * 20, -100, 0]);
            }
            for (var i = 0; i < 11; i++) {
                var j = i - 5;
                vertices = vertices.concat([100, j * 20, 0, -100, j * 20, 0]);
            }
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        };
        RenderWindow.prototype.initGL = function (gl) {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            this.render();
        };
        RenderWindow.prototype.render = function () {
            if (!this.ready)
                return;
            var gl = this.gl;
            gl.viewport(0, 0, this.width, this.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            this.projectionMatrix = this.camera.projectionMatrix;
            this.modelViewMatrix = this.camera.matrix;
            this.drawGrid(this.gl);
        };
        RenderWindow.prototype.drawGrid = function (gl) {
            var shader = ShaderManager.shader["grid"];
            gl.useProgram(shader);
            gl.uniformMatrix4fv(gl.getUniformLocation(shader, "projectionMatrix"), false, new Float32Array(this.projectionMatrix));
            gl.uniformMatrix4fv(gl.getUniformLocation(shader, "modelviewMatrix"), false, new Float32Array(this.modelViewMatrix));
            gl.bindBuffer(gl.ARRAY_BUFFER, this.gridBuffer);
            gl.enableVertexAttribArray(gl.getAttribLocation(shader, "aVertexPosition"));
            gl.vertexAttribPointer(gl.getAttribLocation(shader, "aVertexPosition"), 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.LINES, 0, 44);
        };
        return RenderWindow;
    }());
    exports.__esModule = true;
    exports["default"] = RenderWindow;
});
define("Dialog", ["require", "exports"], function (require, exports) {
    "use strict";
    var Dialog = (function () {
        function Dialog(element) {
            this.element = element;
            this.onResult = function () { };
        }
        Dialog.prototype.close = function () {
            this.onDestroy();
            this.element.parentElement.removeChild(this.element);
        };
        Dialog.prototype.onCreated = function (params) {
        };
        Dialog.prototype.onDestroy = function () {
        };
        Dialog.prototype.result = function (result) {
            this.onResult(result);
        };
        return Dialog;
    }());
    exports.__esModule = true;
    exports["default"] = Dialog;
});
define("Dialogs/ControllerSelect", ["require", "exports", "Dialog"], function (require, exports, Dialog_1) {
    "use strict";
    var ControllerSelect = (function (_super) {
        __extends(ControllerSelect, _super);
        function ControllerSelect() {
            _super.apply(this, arguments);
        }
        ControllerSelect.prototype.onCreated = function (params) {
            var _this = this;
            var list = document.getElementById("SelectList");
            var _loop_1 = function(controller) {
                var option = document.createElement("a");
                option.className = "ControllerSelectOption";
                option.setAttribute("href", "#");
                option.appendChild(document.createTextNode(controller.displayName));
                option.addEventListener("click", function (event) { return _this.onOptionClick(event, controller); });
                list.appendChild(option);
            };
            for (var _i = 0, _a = params.list; _i < _a.length; _i++) {
                var controller = _a[_i];
                _loop_1(controller);
            }
        };
        ControllerSelect.prototype.onOptionClick = function (event, controller) {
            this.result(controller);
            this.close();
            event.preventDefault();
        };
        return ControllerSelect;
    }(Dialog_1["default"]));
    exports.__esModule = true;
    exports["default"] = ControllerSelect;
});
define("DialogManager", ["require", "exports", "Dialogs/ControllerSelect"], function (require, exports, ControllerSelect_1) {
    "use strict";
    var DialogList = {
        "ControllerSelect": ControllerSelect_1["default"]
    };
    var DialogManager = (function () {
        function DialogManager() {
        }
        DialogManager.open = function (name, params, callback) {
            var element = document.createElement("div");
            element.className = "Dialog";
            document.body.appendChild(element);
            var closeBtn = document.createElement("a");
            closeBtn.className = "DialogCloseButton";
            closeBtn.setAttribute("href", "#");
            closeBtn.appendChild(document.createTextNode("X"));
            element.appendChild(closeBtn);
            var content = document.createElement("div");
            element.appendChild(content);
            var dialog = new DialogList[name](element);
            closeBtn.addEventListener("click", function (event) {
                dialog.close();
                event.preventDefault();
            });
            var request = new XMLHttpRequest();
            request.addEventListener("load", function (event) {
                content.innerHTML = event.currentTarget.responseText;
                var size = element.getBoundingClientRect();
                element.style.marginLeft = (-size.width / 2) + "px";
                element.style.marginTop = (-size.height / 2) + "px";
                dialog.onResult = callback;
                dialog.onCreated(params);
            });
            request.addEventListener("error", function () {
                console.error("Failed to load dialog content " + name + ".html");
                dialog.close();
            });
            request.open("GET", "Dialogs/" + name + ".html");
            request.send();
        };
        return DialogManager;
    }());
    exports.__esModule = true;
    exports["default"] = DialogManager;
});
var ShaderManager = (function () {
    function ShaderManager() {
    }
    ShaderManager.init = function (gl, callback) {
        var _this = this;
        this.toLoad = this.shaders.length;
        this.callback = callback;
        this.shader = {};
        this.shaderSource = {};
        this.gl = gl;
        var _loop_2 = function(shader) {
            var request = new XMLHttpRequest();
            request.addEventListener("load", function (event) { return _this.onLoad(shader, event); });
            request.addEventListener("error", function (event) { return _this.onError(shader, event); });
            request.open("GET", shader.path);
            request.send();
        };
        for (var _i = 0, _a = this.shaders; _i < _a.length; _i++) {
            var shader = _a[_i];
            _loop_2(shader);
        }
    };
    ShaderManager.createShader = function (name, vertexSource, fragmentSource) {
        var vShader = this.compileProgram(this.gl, vertexSource, false);
        var fShader = this.compileProgram(this.gl, fragmentSource, true);
        var program = this.gl.createProgram();
        this.gl.attachShader(program, vShader);
        this.gl.attachShader(program, fShader);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error("Could not link shader: " + name);
        }
        this.shader[name] = program;
        console.log("Successfully loaded shader '" + name + "'.");
    };
    ShaderManager.compileProgram = function (gl, source, fragment) {
        var shader = fragment ? gl.createShader(gl.FRAGMENT_SHADER) : gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
        }
        return shader;
    };
    ShaderManager.onLoad = function (shader, event) {
        this.toLoad--;
        if (this.shaderSource[shader.name] === undefined) {
            this.shaderSource[shader.name] = event.currentTarget.responseText;
        }
        else {
            var vertexSource = shader.fragment ? this.shaderSource[shader.name] : event.currentTarget.responseText;
            var fragmentSource = !shader.fragment ? this.shaderSource[shader.name] : event.currentTarget.responseText;
            this.createShader(shader.name, vertexSource, fragmentSource);
        }
        if (this.toLoad === 0)
            this.onLoadComplete();
    };
    ShaderManager.onError = function (shader, event) {
        console.error("Error loading shader " + shader.path);
        this.toLoad--;
        if (this.toLoad === 0)
            this.onLoadComplete();
    };
    ShaderManager.onLoadComplete = function () {
        this.callback();
    };
    ShaderManager.shaders = [
        { name: "grid", path: "Shaders/grid.vert", fragment: false },
        { name: "grid", path: "Shaders/grid.frag", fragment: true },
        { name: "renderSprite", path: "Shaders/renderSprite.vert", fragment: false },
        { name: "renderSprite", path: "Shaders/renderSprite.frag", fragment: true }
    ];
    return ShaderManager;
}());
var Controller = (function () {
    function Controller() {
        this.onParamChanged = function (key, value) { };
        this.param = {};
        for (var _i = 0, _a = this.constructor.options; _i < _a.length; _i++) {
            var option = _a[_i];
            this.param[option.key] = option.defVal;
        }
    }
    Controller.prototype.reset = function () {
    };
    Controller.prototype.getButton = function () {
        var elem = document.createElement("div");
        elem.className = "ControllerBtn";
        var textNode = document.createTextNode(this.constructor.displayName);
        elem.appendChild(textNode);
        return elem;
    };
    Controller.prototype.populateOptions = function (container) {
        container.innerHTML = "";
        for (var _i = 0, _a = this.constructor.options; _i < _a.length; _i++) {
            var option = _a[_i];
            var elem = option.getOptionHTML(this);
            option.onValueChanged = this.onOptionChange.bind(this);
            container.appendChild(elem);
        }
    };
    Controller.prototype.onOptionChange = function (key, value) {
        this.param[key] = value;
        this.onParamChanged(key, value);
    };
    Controller.displayName = "[[UNNAMED CONTROLLER]]";
    Controller.options = [];
    return Controller;
}());
define("Controllers/Renderers/RenderSprites", ["require", "exports"], function (require, exports) {
    "use strict";
    var RenderSprites = (function (_super) {
        __extends(RenderSprites, _super);
        function RenderSprites(gl) {
            _super.call(this);
            this.gl = gl;
            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            var vertices = [
                -1.0, -1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, -1.0, 0.0,
                1.0, 1.0, 0.0
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        }
        RenderSprites.prototype.render = function (particles, projectionMatrix, modelViewMatrix) {
            var gl = this.gl;
            var shader = ShaderManager.shader["renderSprite"];
            gl.useProgram(shader);
            gl.uniformMatrix4fv(gl.getUniformLocation(shader, "projectionMatrix"), false, new Float32Array(projectionMatrix));
            gl.uniformMatrix4fv(gl.getUniformLocation(shader, "modelviewMatrix"), false, new Float32Array(modelViewMatrix));
            for (var _i = 0, particles_1 = particles; _i < particles_1.length; _i++) {
                var particle = particles_1[_i];
                var modelMatrix = mat4.fromScaling(mat4.create(), vec3.fromValues(particle.radius, particle.radius, particle.radius));
                var rotation = mat4.getRotation(quat.create(), modelViewMatrix);
                quat.invert(rotation, rotation);
                var rotationTransMatrix = mat4.fromRotationTranslation(mat4.create(), rotation, particle.position);
                mat4.multiply(modelMatrix, rotationTransMatrix, modelMatrix);
                gl.uniformMatrix4fv(gl.getUniformLocation(shader, "modelMatrix"), false, new Float32Array(modelMatrix));
                gl.uniform3f(gl.getUniformLocation(shader, "color"), particle.color[0], particle.color[1], particle.color[2]);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
                gl.enableVertexAttribArray(gl.getAttribLocation(shader, "aVertexPosition"));
                gl.vertexAttribPointer(gl.getAttribLocation(shader, "aVertexPosition"), 3, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }
        };
        RenderSprites.displayName = "Render Sprites";
        RenderSprites.options = [];
        return RenderSprites;
    }(Controller));
    exports.__esModule = true;
    exports["default"] = RenderSprites;
});
define("Controllers/RendererList", ["require", "exports", "Controllers/Renderers/RenderSprites"], function (require, exports, RenderSprites_1) {
    "use strict";
    exports.RendererList = [
        RenderSprites_1["default"]
    ];
});
var ControllerOptionType;
(function (ControllerOptionType) {
    ControllerOptionType[ControllerOptionType["Boolean"] = 0] = "Boolean";
    ControllerOptionType[ControllerOptionType["Number"] = 1] = "Number";
    ControllerOptionType[ControllerOptionType["Vec3"] = 2] = "Vec3";
})(ControllerOptionType || (ControllerOptionType = {}));
var ControllerOption = (function () {
    function ControllerOption(type, key, name, description, defVal) {
        this.type = type;
        this.key = key;
        this.name = name;
        this.description = description;
        this.defVal = defVal;
        this.onValueChanged = function () { };
    }
    ControllerOption.prototype.getOptionHTML = function (controller) {
        var _this = this;
        var node = document.createElement("div");
        node.className = "ControllerOption";
        var text = document.createTextNode(this.name);
        node.appendChild(text);
        switch (this.type) {
            case ControllerOptionType.Boolean:
                var tick_1 = document.createElement("input");
                tick_1.className = "ControllerOptionTick";
                tick_1.setAttribute("type", "checkbox");
                tick_1.checked = controller.param[this.key];
                tick_1.addEventListener("change", function () { return _this.onValueChanged(_this.key, tick_1.checked); });
                node.appendChild(tick_1);
                break;
            case ControllerOptionType.Number:
                var inp_1 = document.createElement("input");
                inp_1.className = "ControllerOptionNumber";
                inp_1.setAttribute("type", "number");
                inp_1.value = controller.param[this.key];
                inp_1.addEventListener("change", function () { return _this.onValueChanged(_this.key, parseInt(inp_1.value)); });
                node.appendChild(inp_1);
                break;
            case ControllerOptionType.Vec3:
                var inp1_1 = document.createElement("input");
                inp1_1.className = "ControllerOptionVectorComponent";
                inp1_1.setAttribute("type", "number");
                inp1_1.value = controller.param[this.key][0];
                var inp2_1 = document.createElement("input");
                inp2_1.className = "ControllerOptionVectorComponent";
                inp2_1.setAttribute("type", "number");
                inp2_1.value = controller.param[this.key][1];
                var inp3_1 = document.createElement("input");
                inp3_1.className = "ControllerOptionVectorComponent";
                inp3_1.setAttribute("type", "number");
                inp3_1.value = controller.param[this.key][2];
                var callback = function () {
                    var vec = vec3.create();
                    try {
                        vec[0] = parseInt(inp1_1.value);
                        vec[1] = parseInt(inp2_1.value);
                        vec[2] = parseInt(inp3_1.value);
                    }
                    catch (e) {
                    }
                    this.onValueChanged(this.key, vec);
                };
                inp1_1.addEventListener("change", callback.bind(this));
                inp2_1.addEventListener("change", callback.bind(this));
                inp3_1.addEventListener("change", callback.bind(this));
                node.appendChild(inp3_1);
                node.appendChild(inp2_1);
                node.appendChild(inp1_1);
                break;
            default:
                console.error("Unknown controller option type for option " + this.key);
        }
        return node;
    };
    ControllerOption.Boolean = function (key, name, description, defVal) {
        return new ControllerOption(ControllerOptionType.Boolean, key, name, description, defVal);
    };
    ControllerOption.Number = function (key, name, description, defVal) {
        return new ControllerOption(ControllerOptionType.Number, key, name, description, defVal);
    };
    ControllerOption.Vec3 = function (key, name, description, defVal) {
        return new ControllerOption(ControllerOptionType.Vec3, key, name, description, defVal);
    };
    return ControllerOption;
}());
define("Controllers/Operators/MovementBasic", ["require", "exports"], function (require, exports) {
    "use strict";
    var MovementBasic = (function (_super) {
        __extends(MovementBasic, _super);
        function MovementBasic() {
            _super.apply(this, arguments);
        }
        MovementBasic.prototype.operate = function (particles, timestep) {
            for (var _i = 0, particles_2 = particles; _i < particles_2.length; _i++) {
                var particle = particles_2[_i];
                var gravity = vec3.clone(this.param["gravity"]);
                vec3.scale(gravity, gravity, timestep);
                vec3.add(particle.velocity, particle.velocity, gravity);
                var step = vec3.clone(particle.velocity);
                vec3.scale(step, step, timestep);
                vec3.add(particle.position, particle.position, step);
            }
        };
        MovementBasic.displayName = "Movement Basic";
        MovementBasic.options = [
            ControllerOption.Vec3("gravity", "Gravity", "", vec3.create())
        ];
        return MovementBasic;
    }(Controller));
    exports.__esModule = true;
    exports["default"] = MovementBasic;
});
define("Controllers/Operators/LifetimeDecay", ["require", "exports"], function (require, exports) {
    "use strict";
    var LifetimeDecay = (function (_super) {
        __extends(LifetimeDecay, _super);
        function LifetimeDecay() {
            _super.apply(this, arguments);
        }
        LifetimeDecay.prototype.operate = function (particles, timestep) {
            var remove = [];
            for (var key = 0; key < particles.length; key++) {
                var particle = particles[key];
                particle.lifetime -= timestep;
                if (particle.lifetime <= 0) {
                    remove.push(key);
                }
            }
            var offset = 0;
            for (var _i = 0, remove_1 = remove; _i < remove_1.length; _i++) {
                var index = remove_1[_i];
                particles.splice(index - offset++, 1);
            }
        };
        LifetimeDecay.displayName = "Lifetime Decay";
        LifetimeDecay.options = [];
        return LifetimeDecay;
    }(Controller));
    exports.__esModule = true;
    exports["default"] = LifetimeDecay;
});
define("Controllers/OperatorList", ["require", "exports", "Controllers/Operators/MovementBasic", "Controllers/Operators/LifetimeDecay"], function (require, exports, MovementBasic_1, LifetimeDecay_1) {
    "use strict";
    exports.OperatorList = [
        MovementBasic_1["default"],
        LifetimeDecay_1["default"]
    ];
});
define("Controllers/Initializers/PositionOnRing", ["require", "exports"], function (require, exports) {
    "use strict";
    var PositionOnRing = (function (_super) {
        __extends(PositionOnRing, _super);
        function PositionOnRing() {
            _super.apply(this, arguments);
            this.index = 0;
        }
        PositionOnRing.prototype.initialize = function (particle) {
            var angle = this.param["uniform"] ? 2 * Math.PI * (this.index++) / (this.param["amount"]) : Math.random() * Math.PI * 2;
            var radius = parseInt(this.param["radius"]);
            particle.position = vec3.fromValues(radius * Math.cos(angle), radius * Math.sin(angle), 0);
        };
        PositionOnRing.prototype.reset = function () {
            this.index = 0;
        };
        PositionOnRing.displayName = "Position On Ring";
        PositionOnRing.options = [
            ControllerOption.Number("radius", "Ring radius", "radius", 100),
            ControllerOption.Number("amount", "Amount in ring", "", 100),
            ControllerOption.Boolean("uniform", "Uniform distribution", "uniform", false)
        ];
        return PositionOnRing;
    }(Controller));
    exports.__esModule = true;
    exports["default"] = PositionOnRing;
});
define("Controllers/Initializers/PositionInSphere", ["require", "exports"], function (require, exports) {
    "use strict";
    var PositionInSphere = (function (_super) {
        __extends(PositionInSphere, _super);
        function PositionInSphere() {
            _super.apply(this, arguments);
        }
        PositionInSphere.prototype.initialize = function (particle) {
            var vec = vec3.fromValues(Math.random(), Math.random(), Math.random());
            vec3.normalize(vec, vec);
            vec3.scale(vec, vec, Math.random() * this.param["radius"]);
            particle.position = vec;
        };
        PositionInSphere.displayName = "Position In Sphere";
        PositionInSphere.options = [
            ControllerOption.Number("radius", "Ring radius", "radius", 100)
        ];
        return PositionInSphere;
    }(Controller));
    exports.__esModule = true;
    exports["default"] = PositionInSphere;
});
define("Controllers/Initializers/LifetimeRandom", ["require", "exports"], function (require, exports) {
    "use strict";
    var LifteimeRandom = (function (_super) {
        __extends(LifteimeRandom, _super);
        function LifteimeRandom() {
            _super.apply(this, arguments);
        }
        LifteimeRandom.prototype.initialize = function (particle) {
            var min = Math.min(this.param["min"], this.param["max"]);
            var max = Math.max(this.param["min"], this.param["max"]);
            particle.lifetime = min + Math.random() * (max - min);
        };
        LifteimeRandom.displayName = "Lifetime Random";
        LifteimeRandom.options = [
            ControllerOption.Number("min", "Minimum lifetime", "radius", 0),
            ControllerOption.Number("max", "Maximum lifetime", "", 1),
        ];
        return LifteimeRandom;
    }(Controller));
    exports.__esModule = true;
    exports["default"] = LifteimeRandom;
});
define("Controllers/Initializers/ColorRandom", ["require", "exports"], function (require, exports) {
    "use strict";
    var ColorRandom = (function (_super) {
        __extends(ColorRandom, _super);
        function ColorRandom() {
            _super.apply(this, arguments);
        }
        ColorRandom.prototype.initialize = function (particle) {
            particle.color = vec3.fromValues(Math.random(), Math.random(), Math.random());
        };
        ColorRandom.displayName = "Color Random";
        ColorRandom.options = [];
        return ColorRandom;
    }(Controller));
    exports.__esModule = true;
    exports["default"] = ColorRandom;
});
define("Controllers/Initializers/RadiusRandom", ["require", "exports"], function (require, exports) {
    "use strict";
    var RadiusRandom = (function (_super) {
        __extends(RadiusRandom, _super);
        function RadiusRandom() {
            _super.apply(this, arguments);
        }
        RadiusRandom.prototype.initialize = function (particle) {
            var min = Math.min(this.param["min"], this.param["max"]);
            var max = Math.max(this.param["min"], this.param["max"]);
            particle.radius = min + Math.random() * (max - min);
        };
        RadiusRandom.displayName = "Radius Random";
        RadiusRandom.options = [
            ControllerOption.Number("min", "Minimum radius", "radius", 1),
            ControllerOption.Number("max", "Maximum radius", "", 2),
        ];
        return RadiusRandom;
    }(Controller));
    exports.__esModule = true;
    exports["default"] = RadiusRandom;
});
define("Controllers/InitializerList", ["require", "exports", "Controllers/Initializers/PositionOnRing", "Controllers/Initializers/PositionInSphere", "Controllers/Initializers/LifetimeRandom", "Controllers/Initializers/ColorRandom", "Controllers/Initializers/RadiusRandom"], function (require, exports, PositionOnRing_1, PositionInSphere_1, LifetimeRandom_1, ColorRandom_1, RadiusRandom_1) {
    "use strict";
    exports.InitializerList = [
        PositionOnRing_1["default"],
        PositionInSphere_1["default"],
        LifetimeRandom_1["default"],
        ColorRandom_1["default"],
        RadiusRandom_1["default"]
    ];
});
define("Controllers/Emitters/EmitInstant", ["require", "exports", "Particle"], function (require, exports, Particle_1) {
    "use strict";
    var EmitInstant = (function (_super) {
        __extends(EmitInstant, _super);
        function EmitInstant(callback) {
            _super.call(this);
            this.callback = callback;
        }
        EmitInstant.prototype.start = function () {
            for (var i = 0; i < this.param["amount"]; i++) {
                var particle = new Particle_1["default"]();
                this.callback(particle);
            }
        };
        EmitInstant.prototype.stop = function () {
        };
        EmitInstant.prototype.tick = function (frameTime) {
        };
        EmitInstant.displayName = "Emit Instantly";
        EmitInstant.options = [
            ControllerOption.Number("amount", "Amount", "", 30)
        ];
        return EmitInstant;
    }(Controller));
    exports.__esModule = true;
    exports["default"] = EmitInstant;
});
define("Controllers/Emitters/EmitContinuous", ["require", "exports", "Particle"], function (require, exports, Particle_2) {
    "use strict";
    var EmitContinuous = (function (_super) {
        __extends(EmitContinuous, _super);
        function EmitContinuous(callback) {
            _super.call(this);
            this.nextSpawn = 0;
            this.callback = callback;
            this.spawning = false;
        }
        EmitContinuous.prototype.start = function () {
            this.spawning = true;
        };
        EmitContinuous.prototype.stop = function () {
            this.spawning = false;
        };
        EmitContinuous.prototype.tick = function (frameTime) {
            if (this.spawning) {
                var interval = 1 / this.param["rate"];
                this.nextSpawn -= frameTime;
                while (this.nextSpawn <= 0) {
                    this.spawn();
                    this.nextSpawn += interval;
                }
            }
        };
        EmitContinuous.prototype.spawn = function () {
            var particle = new Particle_2["default"]();
            this.callback(particle);
        };
        EmitContinuous.displayName = "Emit Continuous";
        EmitContinuous.options = [
            ControllerOption.Number("rate", "Emission rate", "", 50)
        ];
        return EmitContinuous;
    }(Controller));
    exports.__esModule = true;
    exports["default"] = EmitContinuous;
});
define("Controllers/EmitterList", ["require", "exports", "Controllers/Emitters/EmitInstant", "Controllers/Emitters/EmitContinuous"], function (require, exports, EmitInstant_1, EmitContinuous_1) {
    "use strict";
    exports.EmitterList = [
        EmitInstant_1["default"],
        EmitContinuous_1["default"]
    ];
});
define("ParticleEditor", ["require", "exports", "ParticleSystem", "RenderWindow", "DialogManager", "Controllers/RendererList", "Controllers/OperatorList", "Controllers/InitializerList", "Controllers/EmitterList"], function (require, exports, ParticleSystem_1, RenderWindow_1, DialogManager_1, RendererList_1, OperatorList_1, InitializerList_1, EmitterList_1) {
    "use strict";
    var elem = function (id) { return document.getElementById(id); };
    var ParticleEditor = (function () {
        function ParticleEditor() {
            var _this = this;
            this.previousTick = new Date().getTime();
            this.paused = false;
            this.system = new ParticleSystem_1["default"]();
            this.renderWindow = new RenderWindow_1["default"](elem("canvas"));
            elem("Add1").addEventListener("click", this.onAddRenderer.bind(this));
            elem("Add2").addEventListener("click", this.onAddOperator.bind(this));
            elem("Add3").addEventListener("click", this.onAddInitializer.bind(this));
            elem("Add4").addEventListener("click", this.onAddEmitter.bind(this));
            elem("PlayBtn").addEventListener("click", function (ev) { ev.preventDefault(); _this.paused = false; _this.system.restart(); });
            elem("PauseBtn").addEventListener("click", function (ev) { ev.preventDefault(); _this.paused = !_this.paused; });
            elem("StopBtn").addEventListener("click", function (ev) { ev.preventDefault(); _this.system.stop(true); });
            elem("StopBtn2").addEventListener("click", function (ev) { ev.preventDefault(); _this.system.stop(false); });
            window.requestAnimationFrame(this.tick.bind(this));
        }
        ParticleEditor.prototype.onAddRenderer = function (event) {
            DialogManager_1["default"].open("ControllerSelect", { list: RendererList_1.RendererList }, (function (result) {
                var _this = this;
                var renderer = new result(this.renderWindow.gl);
                this.addControllerButton(renderer, elem("CList1"));
                this.system.renderers.push(renderer);
                this.system.restart();
                renderer.onParamChanged = function () { return _this.system.restart(); };
            }).bind(this));
        };
        ParticleEditor.prototype.onAddOperator = function (event) {
            DialogManager_1["default"].open("ControllerSelect", { list: OperatorList_1.OperatorList }, (function (result) {
                var _this = this;
                var operator = new result();
                this.addControllerButton(operator, elem("CList2"));
                this.system.operators.push(operator);
                this.system.restart();
                operator.onParamChanged = function () { return _this.system.restart(); };
            }).bind(this));
        };
        ParticleEditor.prototype.onAddInitializer = function (event) {
            DialogManager_1["default"].open("ControllerSelect", { list: InitializerList_1.InitializerList }, (function (result) {
                var _this = this;
                var initializer = new result();
                this.addControllerButton(initializer, elem("CList3"));
                this.system.initializers.push(initializer);
                this.system.restart();
                initializer.onParamChanged = function () { return _this.system.restart(); };
            }).bind(this));
        };
        ParticleEditor.prototype.onAddEmitter = function (event) {
            DialogManager_1["default"].open("ControllerSelect", { list: EmitterList_1.EmitterList }, (function (result) {
                var _this = this;
                var emitter = new result(this.system.onParticleSpawn.bind(this.system));
                this.addControllerButton(emitter, elem("CList4"));
                this.system.emitters.push(emitter);
                this.system.restart();
                emitter.onParamChanged = function () { return _this.system.restart(); };
            }).bind(this));
        };
        ParticleEditor.prototype.addControllerButton = function (controller, targetList) {
            var _this = this;
            var button = controller.getButton();
            button.addEventListener("click", function (ev) { return _this.controllerClick(ev, controller); });
            targetList.appendChild(button);
        };
        ParticleEditor.prototype.controllerClick = function (ev, controller) {
            controller.populateOptions(elem("optionList"));
        };
        ParticleEditor.prototype.createTextBox = function (text) {
            var div = document.createElement("div");
            var textNode = document.createTextNode(text);
            div.appendChild(textNode);
            return div;
        };
        ParticleEditor.prototype.tick = function () {
            var time = new Date().getTime();
            var frameTime = (time - this.previousTick) / 1000;
            this.previousTick = time;
            elem("fpsInfo").innerText = "FPS: " + Math.floor(1 / frameTime);
            elem("particleInfo").innerText = "Particles: " + this.system.particles.length;
            this.system.tick(this.paused ? 0 : frameTime);
            this.renderWindow.render();
            this.system.render(this.renderWindow.gl, this.renderWindow.projectionMatrix, this.renderWindow.modelViewMatrix);
            window.requestAnimationFrame(this.tick.bind(this));
        };
        return ParticleEditor;
    }());
    var editor = new ParticleEditor();
});
var Camera = (function () {
    function Camera() {
        this.fov = Math.PI / 2;
        this.near = 0.1;
        this.far = 1000;
        this.position = vec3.fromValues(120, 120, 120);
        this.target = vec3.create();
        this.matrix = mat4.create();
        this.projectionMatrix = mat4.create();
        this.updateMatrix();
    }
    Camera.prototype.updateMatrix = function () {
        mat4.lookAt(this.matrix, this.position, this.target, vec3.fromValues(0, 0, 1));
    };
    Camera.prototype.updateProjection = function (aspectRatio) {
        mat4.perspective(this.projectionMatrix, this.fov, aspectRatio, this.near, this.far);
    };
    return Camera;
}());
//# sourceMappingURL=editor.js.map