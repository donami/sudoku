class Sudoku {

    constructor(grid) {
        this._size = 4;
        this._grid = grid ? grid : this.createEmptyGrid();
        this._parsedGrid = null;
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * 4) + 1;
    }

    createEmptyGrid() {
        const random = this.randomNumber(1, this._size);

        const grid = [...Array(this._size)].map((_, i) => {

            return [...Array(this._size)].map((_, y) => 0);
        });

        grid[random - 1][random - 1] = random;

        return grid;
    }

    storeEmptyCells(grid) {

        // Loop through all the numbers and look for empty cells
        return grid.reduce((emptyCells, row, rowIndex) => {

            row.forEach((column, columnIdx) => {
                // If a zero is found, so that position
                if (grid[rowIndex][columnIdx] === 0) {
                    emptyCells.push([rowIndex, columnIdx]);
                }
            });

            return emptyCells;
        }, []);
    }

    isRowValid(grid, row, value) {

        return grid[row].indexOf(value) === -1;
    }

    isColumnValid(grid, column, value) {

        return grid.reduce((valid, row) => {

            if (row[column] === value) {
                valid = false;
            }

            return valid;
        }, true);
    }

    isSquareValid(grid, column, row, value) {
        // Save the upper left corner
        let corner = 0,
        rowCorner = 0,
        squareSize = Math.sqrt(this._size);

        // Find the left-most column
        while (column >= corner + squareSize) {
            corner += squareSize;
        }

        // Find the upper-most row
        while (row >= rowCorner + squareSize) {
            rowCorner += squareSize;
        }

        // Loop through every row
        for (let rowIdx = rowCorner; rowIdx < rowCorner + squareSize; rowIdx++) {
            // Loop through every column
            for (let columnIdx = corner; columnIdx < corner + squareSize; columnIdx++) {

                // If a match is found, return false
                if (grid[rowIdx][columnIdx] === value) {
                    return false;
                }
            }
        }
        // If no match was found, return true
        return true;
    }

    isCellValid(grid, column, row, value) {

        return this.isRowValid(grid, row, value) &&
            this.isColumnValid(grid, column, value) &&
            this.isSquareValid(grid, column, row, value);
    }

    solver(grid, emptyCells) {

        const limit = this._size;
        let i, row, column, number, found;

        // Loop through the empty cells
        for (i = 0; i < emptyCells.length;) {
            row = emptyCells[i][0];
            column = emptyCells[i][1];

            // Next number
            number = grid[row][column] + 1;

            found = false;

            // Try new numbers until limit is reached or number was found
            while (!found && number <= limit) {

                // If valid number was found, assign the number and move to the next cell
                if (this.isCellValid(grid, column, row, number)) {
                    grid[row][column] = number;
                    found = true;
                    i++;
                }
                else {
                    number++;
                }
            }

            // If no valid number is found, go back to previous cell
            if (!found) {
                grid[row][column] = 0;
                i--;
            }
        }

        // return the solution
        return grid;
    }

    generate() {
        this._parsedGrid = this.solve().map((row, index) => {

            return row.map((number, k) => {

                if ((index % 2 === 0 && k % 2 === 0)
                    || (index % 2 !== 0 && k % 2 !== 0)) {
                    return 0;
                }

                return number;
            });
        });

        return this._parsedGrid;
    }

    solve() {
        const emptyCells = this.storeEmptyCells(this._grid);

        this._parsedGrid = this.solver(this._grid, emptyCells);

        return this._parsedGrid;
    }

    display() {

        const container = document.createElement('div');

        container.classList.add('sudoku-container');

        if (this._parsedGrid === null) {
            throw new Error('Grid has not been generated');
        }

        let rowElem, cellElem;

        this._parsedGrid.forEach(row => {

            rowElem = document.createElement('div');
            rowElem.classList.add('sudoku-row');

            row.forEach(cell => {
                cellElem = document.createElement('span');

                if (cell !== 0) {
                    cellElem.innerHTML = cell;
                }

                rowElem.appendChild(cellElem);
            });

            container.appendChild(rowElem);
        });

        document.body.appendChild(container);
    }
}

const sudoku = new Sudoku();

sudoku.generate();
sudoku.display();