{/* Find the onProgress handler that plays the typing sound and add debug logging */ }
onProgress = {() => {
    console.log('Code typing progress, playing typing sound');
    onProgress?.();
}} 