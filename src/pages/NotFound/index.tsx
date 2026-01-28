import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const requestRef = useRef<number>(0);
  
  // UI 状态
  const [showRestart, setShowRestart] = useState(false);
  const [titleOpacity, setTitleOpacity] = useState(0);

  useEffect(() => {
    // 渐显标题
    const timer = setTimeout(() => setTitleOpacity(1), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 游戏配置
    const CONFIG = {
      brickGap: 4,
      ballSpeed: 6,
      paddleWidth: 120,
      paddleHeight: 12,
      colors: {
          brick: '#60a5fa', // blue-400
          ball: '#ffffff',
          paddle: '#3b82f6', // blue-500
          bg: '#0f0f11'
      }
    };

    // 404 点阵图 (1: 砖块, 0: 空)
    const MAP_404 = [
      [1,0,0,1, 0,0, 0,1,1,0, 0,0, 1,0,0,1],
      [1,0,0,1, 0,0, 1,0,0,1, 0,0, 1,0,0,1],
      [1,1,1,1, 0,0, 1,0,0,1, 0,0, 1,1,1,1],
      [0,0,0,1, 0,0, 1,0,0,1, 0,0, 0,0,0,1],
      [0,0,0,1, 0,0, 0,1,1,0, 0,0, 0,0,0,1]
    ];

    // 游戏状态
    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseX = width / 2;

    interface Ball {
        x: number;
        y: number;
        dx: number;
        dy: number;
        radius: number;
        active: boolean;
    }

    interface Paddle {
        x: number;
        width: number;
        height: number;
    }

    interface Brick {
        x: number;
        y: number;
        width: number;
        height: number;
        active: boolean;
    }

    interface Particle {
        x: number;
        y: number;
        dx: number;
        dy: number;
        life: number;
        color: string;
    }

    let ball: Ball = {
        x: width / 2,
        y: height - 200,
        dx: CONFIG.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
        dy: -CONFIG.ballSpeed,
        radius: 6,
        active: false
    };

    let paddle: Paddle = {
        x: width / 2 - CONFIG.paddleWidth / 2,
        width: CONFIG.paddleWidth,
        height: CONFIG.paddleHeight
    };

    let bricks: Brick[] = [];
    let particles: Particle[] = [];

    // 初始化方法
    const createBricks = () => {
        bricks = [];
        const rows = MAP_404.length;
        const cols = MAP_404[0].length;
        
        // 计算砖块大小和起始位置以居中
        const brickWidth = Math.min(40, (width - 40) / cols); // 限制最大宽度
        const brickHeight = brickWidth * 0.6;
        const totalWidth = cols * (brickWidth + CONFIG.brickGap) - CONFIG.brickGap;
        const startX = (width - totalWidth) / 2;
        const startY = height * 0.25; // 垂直位置

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (MAP_404[r][c] === 1) {
                    bricks.push({
                        x: startX + c * (brickWidth + CONFIG.brickGap),
                        y: startY + r * (brickHeight + CONFIG.brickGap),
                        width: brickWidth,
                        height: brickHeight,
                        active: true,
                    });
                }
            }
        }
    };

    const resetBall = () => {
        ball.x = width / 2;
        ball.y = height - 100;
        ball.dx = CONFIG.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = -CONFIG.ballSpeed;
        ball.active = false; // 等待用户交互启动
    };

    const createExplosion = (x: number, y: number, color: string) => {
        for (let i = 0; i < 8; i++) {
            particles.push({
                x: x,
                y: y,
                dx: (Math.random() - 0.5) * 8,
                dy: (Math.random() - 0.5) * 8,
                life: 1.0,
                color: color
            });
        }
    };

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        createBricks(); // 重新计算砖块位置
        
        // 移动端适配
        if (width < 768) {
            paddle.width = 80;
            // CONFIG.ballSpeed = 4; // 这里不修改常量，只在初始化时判断
        } else {
            paddle.width = CONFIG.paddleWidth;
        }
    };

    // 游戏循环
    const update = () => {
        // 更新挡板位置 (平滑跟随)
        const targetX = mouseX - paddle.width / 2;
        paddle.x += (targetX - paddle.x) * 0.2;
        
        // 限制挡板范围
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > width) paddle.x = width - paddle.width;

        // 启动球
        if (!ball.active && (Math.abs(mouseX - width/2) > 10 || width < 768)) {
                ball.active = true;
        }

        if (!ball.active) {
            ball.x = paddle.x + paddle.width / 2;
            ball.y = height - 60;
            return;
        }

        // 更新球位置
        ball.x += ball.dx;
        ball.y += ball.dy;

        // 墙壁碰撞
        if (ball.x + ball.radius > width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
        }
        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
        }

        // 掉落重置
        if (ball.y > height) {
            resetBall();
        }

        // 挡板碰撞
        if (
            ball.y + ball.radius > height - 50 &&
            ball.y - ball.radius < height - 50 + paddle.height &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
        ) {
            ball.dy = -Math.abs(ball.dy); // 总是向上反弹
            // 根据击打位置改变 X 速度 (增加操控感)
            const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
            ball.dx = hitPoint * CONFIG.ballSpeed * 1.5;
            
            // 增加粒子效果
            createExplosion(ball.x, height - 50, CONFIG.colors.paddle);
        }

        // 砖块碰撞
        let hit = false;
        bricks.forEach(brick => {
            if (!brick.active || hit) return;

            if (
                ball.x > brick.x &&
                ball.x < brick.x + brick.width &&
                ball.y > brick.y &&
                ball.y < brick.y + brick.height
            ) {
                brick.active = false;
                ball.dy = -ball.dy;
                hit = true;
                createExplosion(brick.x + brick.width/2, brick.y + brick.height/2, CONFIG.colors.brick);
                
                // 检查是否胜利
                if (bricks.every(b => !b.active)) {
                    setTimeout(() => createBricks(), 1000); // 1秒后重置
                }
            }
        });

        // 更新粒子
        particles.forEach((p, i) => {
            p.x += p.dx;
            p.y += p.dy;
            p.life -= 0.02;
            if (p.life <= 0) particles.splice(i, 1);
        });
    };

    const draw = () => {
        ctx.clearRect(0, 0, width, height);

        // 绘制砖块
        bricks.forEach(brick => {
            if (!brick.active) return;
            ctx.fillStyle = CONFIG.colors.brick;
            ctx.shadowBlur = 15;
            ctx.shadowColor = CONFIG.colors.brick;
            ctx.beginPath();
            ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 4);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // 绘制挡板
        ctx.fillStyle = CONFIG.colors.paddle;
        ctx.shadowBlur = 20;
        ctx.shadowColor = CONFIG.colors.paddle;
        ctx.beginPath();
        ctx.roundRect(paddle.x, height - 50, paddle.width, paddle.height, 6);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 绘制球
        ctx.fillStyle = CONFIG.colors.ball;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制粒子
        particles.forEach(p => {
            ctx.fillStyle = `rgba(96, 165, 250, ${p.life})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const loop = () => {
        update();
        draw();
        requestRef.current = requestAnimationFrame(loop);
    };

    // 事件监听
    const handleResize = () => resize();
    const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
    };
    const handleTouchMove = (e: TouchEvent) => {
        mouseX = e.touches[0].clientX;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 初始化
    resize();
    resetBall();
    loop();
    
    // 延迟显示重置按钮
    const restartTimer = setTimeout(() => {
        setShowRestart(true);
    }, 1000);

    return () => {
        if(requestRef.current) cancelAnimationFrame(requestRef.current);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        clearTimeout(restartTimer);
    };
  }, []);

  const handleRestart = () => {
    // 这里简单的刷新页面，或者可以通过状态重置
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] flex flex-col items-center justify-center relative overflow-hidden font-sans text-gray-200">
        <style>{`
            @keyframes pulse-ring {
                0% { transform: scale(0.8); opacity: 0.5; }
                100% { transform: scale(1.3); opacity: 0; }
            }
            .game-hint::before {
                content: '';
                position: absolute;
                left: 50%;
                top: 50%;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
                border-radius: 50%;
                border: 2px solid #3b82f6;
                animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
            }
        `}</style>

        <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full z-[1]"
        />
        
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center relative z-10 min-h-screen pointer-events-none">
          <div className={`space-y-6 transition-opacity duration-500 ${titleOpacity ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative">
                {/* 占位 404，实际由 Canvas 渲染砖块 */}
                <h1 className="text-9xl font-bold text-transparent select-none opacity-0">404</h1>
            </div>
            
            <div className="relative top-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                    页面似乎迷路了
                </h2>
                <p className="text-gray-400 text-lg max-w-md mx-auto mb-8 drop-shadow-md">
                    打破这些阻碍，或许能找到出口...<br/>
                    <span className="text-sm text-blue-500/80 mt-2 block game-hint relative">（移动鼠标或滑动屏幕来控制挡板）</span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto">
                    <button 
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:scale-105 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        返回首页
                    </button>
                    
                    {showRestart && (
                        <button 
                            onClick={handleRestart}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300 backdrop-blur-sm cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            重置游戏
                        </button>
                    )}
                </div>
            </div>
          </div>
        </main>
    </div>
  );
};

export default NotFound;
