//! необходимо две вещи для three.js.
//! 1- библиотека
//! 2- сервер 


// иморт библиотеки three.js
import * as THREE from '../node_modules/three/build/three.module.js';

// Чтобы 3D сцена работала, нужно создать 3 элмента:
// 1. Сцена
// настройки сцены
const scene = new THREE.Scene();
const spaceTexture = new THREE.TextureLoader().load('images/space.jpg');
scene.background = spaceTexture;

// 2. Камера
// Настройка камеры
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// 3. Рендер
// Настройка рендера
const renderer = new THREE.WebGLRenderer(); // сам создает canvas, так что параметры можно не передавать
renderer.setSize(window.innerWidth, window.innerHeight ); // установили размеры соответсвтующие размерам окна
renderer.setClearColor(0xffffff, 0); // прозрачный canvas
// Добавление canvas 
document.body.appendChild(renderer.domElement );


// Глобальное освещение
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// Настройка фигуры (примитив Куб)
const cubeTexture = new THREE.TextureLoader().load('images/cube.jpg');
const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({map:cubeTexture})); // Mesh - сетка
cube.position.z = -2;
cube.rotation.y = 10;
cube.rotation.x = 10;
scene.add(cube);

// Настройка земли (примитив Сфера)
const earthTexture = new THREE.TextureLoader().load('images/earth.jpg');
const earth = new THREE.Mesh( // сетка
    new THREE.SphereGeometry(1, 64, 64), // аргументы: радиус, грани верткал / горизонтал
    new THREE.MeshStandardMaterial({
        map: earthTexture,
    })
);

earth.position.z = -5;
scene.add(earth);

// Добавление звезд на фоне
function addStar() {
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const material = new THREE.MeshStandardMaterial({color: 0xffffff});
    const star = new THREE.Mesh(geometry, material);

    // генерация случайной позиции звезд от 0 до 90 -  с помощью встроенного метода из THREE
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(90));

    // назанчаем позиции звездам
    star.position.set(x, y, z);
    scene.add(star);
}

// массив 200 звезд
Array(200).fill().forEach(addStar);


// Анимация | каждый кадр
function animate() {
    requestAnimationFrame(animate);

// реакция на скролл (приближение по осям) - само событие ниже
    earth.rotation.y += 0.003;
    earth.rotation.x += 0.002;
    earth.rotation.z += 0.002;

    renderer.render(scene, camera);
}

// первый пуск
animate();


// Событие scroll
document.body.onscroll = handlerScroll;
function handlerScroll() {
    const t = document.body.getBoundingClientRect().top; // значение скролла
    
    // прекратить вращать куб, если значение скролла отрицательные
    if(cube.rotation.y > 0 && cube.rotation.x > 0) {
        cube.rotation.y -= 0.01;
        cube.rotation.x -= 0.01;
    } 
        // если доскроллили до планеты, то вращение куба == 0
        if(camera.position.z < -1.4) {
            cube.rotation.y = 0;
            cube.rotation.x = 0;
            if(earth.position.x > -0.8) {
                earth.position.x -= 0.02;
            }
        } else {
            earth.position.x = 0;
        }

        // перемещать камеру в зависимости от скролла
        camera.position.z = t * 0.001;
     
}