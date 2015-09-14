function Vector2() {
	this.x = 0;
	this.y = 0;
}

function Rect(){
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;    
}

Rect.prototype.getTop = function(){
	return this.y;
}
Rect.prototype.getBottom = function(){
	return this.y + this.height;
}
Rect.prototype.getLeft = function(){
	return this.x;
}
Rect.prototype.getRight = function(){
	return this.x + this.width;
}

function Rigidbody() {
	this.velocity = new Vector2();
	this.position = new Vector2();
	this.rotation = 0;
	this.maxRotation = 60;
}

//Update with gravity
Rigidbody.prototype.update = function(deltaTime){
	this.velocity.y += 9.81 * deltaTime;
	this.position.y += this.velocity.y;
	this.rotation += 9.81 * 10 * deltaTime;

	if(this.rotation > this.maxRotation) {
		this.rotation = this.maxRotation;
	}
}

function Bird () {
	var _isDead = true;
	var _rigidbody = new Rigidbody();
	var _domObj = $('.flappy');
	var _collider = new Rect();
	var _canFlap = true;
	var _flapDelay = 0.5;
	var _counter = 0;

    //Set members to init status
	this.init = function () {
	    _isDead = false;
	    _rigidbody.position.x = 40;
	    _rigidbody.position.y = 100;
	    _rigidbody.velocity.x = 0;
	    _rigidbody.velocity.y = 0;
	    _rigidbody.rotation = 0;

	    _domObj.css('top', '0px');
	    _domObj.css('left', '0px');

	    _domObj.css('animation-play-state', 'running');
	    _domObj.css('-webkit-animation-play-state', 'running');
	};

    //Check bird collider with other collider
	this.checkCollision = function(other){
	    if (!(_collider.getLeft() > other.getRight() ||
            _collider.getRight() < other.getLeft() ||
            _collider.getTop() > other.getBottom() ||
            _collider.getBottom() < other.getTop())) {
	        _crash();
	        return true;
	    } else {
	        return false;
	    }
	};

    //Update rigidbody and position
	this.update = function (deltaTime) {
	    if (!_isDead) {

            //Delay for flapping
	        _counter += deltaTime;
	        if (_counter >= _flapDelay) {
	            _canFlap = true;
	            _counter = 0;
	        }

	        _rigidbody.update(deltaTime);
	        _rigidbody.position.y = Math.min(_rigidbody.position.y, 385);
	        _rigidbody.position.y = Math.max(_rigidbody.position.y, -20);
	        _collider.y = _rigidbody.position.y;
	        _domObj.css('transform', 'translate(' + _rigidbody.position.x + 'px, ' + _rigidbody.position.y + 'px) rotate(' + _rigidbody.rotation + 'deg)');
	        _domObj.css('-webkit-transform', 'translate(' + _rigidbody.position.x + 'px, ' + _rigidbody.position.y + 'px) rotate(' + _rigidbody.rotation + 'deg)');
	    }
	};

    //Pause animation
	var _crash = function () {
	    _isDead = true;
	    _domObj.css('animation-play-state', 'paused');
	    _domObj.css('-webkit-animation-play-state', 'paused');
	}

	//Set parameters
	_rigidbody.position.x = 50;
	_collider.x = _rigidbody.position.x;
	_collider.width = 34;
	_collider.height = 24;

	//Register input functions
	$(document).keyup(function(e) {
		if(e.keyCode == 32) {
		    e.preventDefault();
		    if (!_isDead && _canFlap) {
		        _rigidbody.velocity.y = -4.5;
		        _rigidbody.rotation = -60;
		        _canFlap = false;
		    }
		}
	});

	$(document).click(function() {
	    if (!_isDead && _canFlap) {
	        _rigidbody.velocity.y = -4.5;
	        _rigidbody.rotation = -60;
	        _canFlap = false;
	    }
	});
}

function FrontFloor(){
    var _domObj = $('<div class="floor frontFloor"></div>').appendTo(".gameScreen");

    this.stop = function () {
        _domObj.css('animation-play-state', 'paused');
        _domObj.css('-webkit-animation-play-state', 'paused');
    };

    this.init = function () {
        _domObj.css('animation-play-state', 'running');
        _domObj.css('-webkit-animation-play-state', 'running');
    }
}

function BackFloor() {
    var _domObj = $('<div class="floor backFloor"></div>').appendTo(".gameScreen");

    this.stop = function () {
        _domObj.css('animation-play-state', 'paused');
        _domObj.css('-webkit-animation-play-state', 'paused');
    };

    this.init = function () {
        _domObj.css('animation-play-state', 'running');
        _domObj.css('-webkit-animation-play-state', 'running');
    }
}

function PipeBottom(){
    var _domObj = $('<div class="pipeBottom"></div>').appendTo(".gameScreen");
    this.position = new Vector2();
    this.collider = new Rect();

    this.init = function (height) {
        this.position.x = 288;
        this.position.y = 321 - height;
        this.collider.x = this.position.x;
        this.collider.y = this.position.y + 86;
        this.collider.width = 52;
        this.collider.height = height;
        _domObj.css('transform', 'translate(' + this.position.x + 'px, ' + this.position.y + 'px)');
        _domObj.css('-webkit-transform', 'translate(' + this.position.x + 'px, ' + this.position.y + 'px)');
        _domObj.css('height', height + 'px');
    };

    this.update = function (deltaTime) {
        _domObj.css('transform', 'translate(' + this.position.x + 'px, ' + this.position.y + 'px)');
        _domObj.css('-webkit-transform', 'translate(' + this.position.x + 'px, ' + this.position.y + 'px)');
        this.position.x -= deltaTime * 120;
        this.collider.x = this.position.x;
    };

    this.delete = function () {
        _domObj.remove();
    };
}

function PipeTop() {
    var _domObj = $('<div class="pipeTop"></div>').appendTo(".gameScreen");
    this.position = new Vector2();
    this.collider = new Rect();

    this.init = function (height) {
        var h = 307 - height;
        this.position.x = 288;
        this.collider.x = this.position.x;
        this.collider.y = 0;
        this.collider.width = 52;
        this.collider.height = h;
        _domObj.css('transform', 'translate(' + this.position.x + 'px, ' + this.position.y + 'px)');
        _domObj.css('-webkit-transform', 'translate(' + this.position.x + 'px, ' + this.position.y + 'px)');
        _domObj.css('height', h + 'px');
        _domObj.css('background-position', '-112px ' + (h - 966) + 'px');
    };

    this.update = function (deltaTime) {
        _domObj.css('-webkit-transform', 'translate(' + this.position.x + 'px, ' + this.position.y + 'px)');
        _domObj.css('transform', 'translate(' + this.position.x + 'px, ' + this.position.y + 'px)');
        this.position.x -= deltaTime * 120;
        this.collider.x = this.position.x;
    };

    this.delete = function () {
        _domObj.remove();
    };
}

function PipeSpawner(){
    this.pipesTop = new Array();
    this.pipesBottom = new Array();
	var _timePassed = 0;
	var _interval = 2;
	var _currentPipes = 0;

	this.init = function () {
	    while (this.pipesTop.length > 0)
	    {
	        this.pipesTop[0].delete();
	        this.pipesTop.shift();
	        this.pipesBottom[0].delete();
	        this.pipesBottom.shift();
	    }

	    _timePassed = 0;
	    _currentPipes = 0;
	    this.pipesTop.push(new PipeTop());
	    this.pipesTop.push(new PipeTop());
	    this.pipesBottom.push(new PipeBottom());
	    this.pipesBottom.push(new PipeBottom());
	};

	this.update = function (deltaTime) {
	    _timePassed += deltaTime;

	    this.pipesTop[0].update(deltaTime);
	    this.pipesTop[1].update(deltaTime);
	    this.pipesBottom[0].update(deltaTime);
	    this.pipesBottom[1].update(deltaTime);

	    if (_timePassed >= _interval) {
	        var height = (Math.random() * 200) + 50;
	        this.pipesTop[_currentPipes].init(height);
	        this.pipesBottom[_currentPipes].init(height);
	        _currentPipes = (_currentPipes + 1) % 2;
	        _timePassed = 0;
	    }
	};
}

function Title() {
    var _domObj = $('<div class="title"></div>').appendTo(".gameScreen");

    this.hide = function () {
        _domObj.css('display', 'none');
    };
}

function StartButton() {
    var _domObj = $('<div class="startButton"></div>').appendTo(".gameScreen");
    this.collider = new Rect();

    this.show = function () {
        _domObj.css('display', 'block');
    };

    this.hide = function () {
        _domObj.css('display', 'none');
    };

    //Set collider rectangle
    this.collider.x = parseInt(_domObj.css('left'));
    this.collider.y = parseInt(_domObj.css('top'));
    this.collider.width = parseInt(_domObj.css('width'));
    this.collider.height = parseInt(_domObj.css('height'));
}

function ScoreBoard() {
    var _domObjFirst = $('<div class="numbers number0"></div>').appendTo(".gameScreen");
    var _domObjSecond = $('<div class="numbers number0"></div>').appendTo(".gameScreen");
    var _domObjThird = $('<div class="numbers number0"></div>').appendTo(".gameScreen");
    var _score = 0;
    var _timer = -2;
    var _interval = 2;

    this.init = function () {
        _domObjFirst.css('left', '130px');
        _domObjSecond.css('left', '106px');
        _domObjThird.css('left', '82px');
        _timer = -2;
    };

    this.update = function (deltaTime) {
        _timer += deltaTime;

        if (_timer >= _interval) {
            _increment();
            _timer = 0;
        }
    };

    var _increment = function () {
        _domObjFirst.removeClass('number' + _score % 10);
        _domObjSecond.removeClass('number' + (_score - _score % 10) / 10);
        _domObjThird.removeClass('number' + (_score - _score % 100) / 100);
        _score++;
        _domObjFirst.addClass('number' + _score % 10);
        _domObjSecond.addClass('number' + (_score - _score % 10) / 10);
        _domObjThird.addClass('number' + (_score - _score % 100) / 100);

        if (_score >= 10) {
            _domObjSecond.css('display', 'block');
        }

        if (_score >= 100) {
            _domObjThird.css('display', 'block');
        }
    };

    this.reset = function () {
        _domObjFirst.removeClass('number' + _score % 10);
        _domObjSecond.removeClass('number' + (_score - _score % 10) / 10);
        _domObjThird.removeClass('number' + (_score - _score % 100) / 100);
        _score = 0;
        _domObjFirst.addClass('number' + _score % 10);
        _domObjSecond.addClass('number' + (_score - _score % 10) / 10);
        _domObjThird.addClass('number' + (_score - _score % 100) / 100);
    };

    this.show = function () {
        _domObjFirst.css('display', 'block');
        //_domObjSecond.css('display', 'block');
        //_domObjThird.css('display', 'block');
    };

    this.hide = function () {
        _domObjFirst.css('display', 'none');
        _domObjSecond.css('display', 'none');
        _domObjThird.css('display', 'none');
    };
}

$().ready(function() {
    var _date = Date.now();

    //Create world
	var _bird = new Bird();
	var _pipeSpawner = new PipeSpawner();
	var _frontFloor = new FrontFloor();
	var _backFloor = new BackFloor();
	var _floorCollider = new Rect();
	var _startButton = new StartButton();
	var _title = new Title();
	var _scoreBoard = new ScoreBoard();
	var _isRunning = false;
	var _hasStarted = false;

    //Set variables
	_floorCollider.x = 0;
	_floorCollider.y = 407;
	_floorCollider.width = 288;
	_floorCollider.height = 112;

    //Start/Restart game: Initialize objects
	var _startGame = function () {
	    _frontFloor.init();
	    _backFloor.init();
	    _pipeSpawner.init();
	    _scoreBoard.init();
	    _scoreBoard.reset();
	    _scoreBoard.show();
	    _bird.init();
	    _isRunning = true;
	    _date = Date.now();

	    if (!_hasStarted) {
	        requestAnimationFrame(_update);
	        _hasStarted = true;
	    }
	};

    //Main loop: Check collisions and update positions
	var _update = function(){
		var now = Date.now();
		var deltaTime = (now - _date) / 1000;

		_bird.update(deltaTime);

		if (_isRunning) {
		    if (_bird.checkCollision(_floorCollider)
                || _bird.checkCollision(_pipeSpawner.pipesTop[0].collider)
                || _bird.checkCollision(_pipeSpawner.pipesTop[1].collider)
		        || _bird.checkCollision(_pipeSpawner.pipesBottom[0].collider)
		        || _bird.checkCollision(_pipeSpawner.pipesBottom[1].collider)
                ) {
		        _stopGame();
		    }
		    _pipeSpawner.update(deltaTime);
		    _scoreBoard.update(deltaTime);
        }

		_date = now;
		requestAnimationFrame(_update);
	};

    //Pause game after death
	var _stopGame = function () {
	    _frontFloor.stop();
	    _backFloor.stop();
	    _isRunning = false;
	    _startButton.show();
	    $('.gameScreen').fadeOut(0, function () {
	        $('.gameScreen').fadeIn('fast', function () {
	        });
	    });
	};

    //Start button pressed
	$('.startButton').click(function () {
	    if (!_isRunning) {
	        _startButton.hide();
	        _title.hide();
	        _startGame();
	    }
	});
});