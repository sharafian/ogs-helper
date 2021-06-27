export default [{
	input: 'src/background/index.js',
	output: {
		file: 'dist/background/index.js',
		format: 'iife'
	}
}, {
	input: 'src/content/index.js',
	output: {
		file: 'dist/content/index.js',
		format: 'iife'
	}
}, {
	input: 'src/options/options.js',
	output: {
		file: 'dist/options/options.js',
		format: 'iife'
	}
}]
