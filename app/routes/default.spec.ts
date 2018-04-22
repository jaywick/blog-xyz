import { Default } from './default'

describe('redirect', () => {
    it('should reroute to blog post', () => {
        // arrange
        [
            '/47/some-post-slug-here/',
            '/47/some-post-slug-here/',
            '/47/wrong-slug/',
            '/47/',
            '47/some-post-slug-here/',
            '47/some-post-slug-here/',
            '47/wrong-slug/',
            '47/',
            '/47/some-post-slug-here',
            '/47/some-post-slug-here',
            '/47/wrong-slug',
            '/47',
            '47/some-post-slug-here',
            '47/some-post-slug-here',
            '47/wrong-slug',
            '47',
        ].forEach(input => {
            // act
            const result = new Default(null).resolveRedirect(input)

            // assert
            expect(result).toBe('/blog/47')
        })
    })

    it('should reroute to project page', () => {
        // arrange
        [
            '/portfolio/project-x/',
            '/projects/project-x/',
            '/project/project-x/',
            '/portfolio/project-x',
            '/projects/project-x',
            '/project/project-x',
            'portfolio/project-x/',
            'projects/project-x/',
            'project/project-x/',
            'portfolio/project-x',
            'projects/project-x',
            'project/project-x',
        ].forEach(input => {
            // act
            const result = new Default(null).resolveRedirect(input)

            // assert
            expect(result).toBe('/portfolio/project-x')
        })
    })

    it('should reroute to about page', () => {
        // arrange
        [
            '/about/',
            '/about',
            'about/',
            'about',
        ].forEach(input => {
            // act
            const result = new Default(null).resolveRedirect(input)

            // assert
            expect(result).toEqual('/about')
        })
    })

    it('should reroute to portfolio index', () => {
        // arrange
        [
            '/portfolio/',
            '/projects/',
            '/project/',
            '/labs/',
            '/portfolio',
            '/projects',
            '/project',
            '/labs',
            'portfolio/',
            'projects/',
            'project/',
            'labs/',
            'portfolio',
            'projects',
            'project',
            'labs',
        ].forEach(input => {
            // act
            const result = new Default(null).resolveRedirect(input)

            // assert
            expect(result).toEqual('/portfolio')
        })
    })

    it('should reroute to blog index', () => {
        // arrange
        [
            '/blog/',
            '/blog',
            'blog/',
            'blog',
        ].forEach(input => {
            // act
            const result = new Default(null).resolveRedirect(input)

            // assert
            expect(result).toEqual('/blog')
        })
    })

    it('should not resolve if no matches', () => {
        // arrange
        [
            '/dfgdgdfgdfg',
            '/ABC/ABCDEF',
            '/70redgteg/',
            '/70redgteg',
            '70redgteg/',
            '70redgteg',
        ].forEach(input => {
            // act
            const result = new Default(null).resolveRedirect(input)

            // assert
            expect(result).toBe(null)
        })
    })
})
