import Component from '@glimmer/component';

export default class RentalsFilterComponent extends Component {
    get results() {
        let { rentals, query } = this.args;

        if (query) {
            rentals = rentals.filter(
                (rental) => rental.title.includes(query) | rental.city.includes(query) | rental.type.includes(query)
            );
        }

        return rentals;
    }
}
