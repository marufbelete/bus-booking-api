const {gql}=require('apollo-server-express')
const typeDefs=gql`
scalar Date
scalar Time
scalar DateTime
type Ticket{
    year:Int
    month:Int
    totalTicket:Int
    agentName:String
    totalPrice:Int
 }
input SaleInputFilteasr {
    day:Boolean
    week:Boolean
    month:Boolean
    year:Boolean
    }
input SaleInputFilter {
    filter:String
    }

type Query{
getLocalTotalSale(input:SaleInputFilter):Ticket
getAgentTotalSale(input:SaleInputFilter):Ticket
getMobileTotalSale(input:SaleInputFilter):Ticket
getEachAgentSale(input:SaleInputFilter):[Ticket]
getGroupMonthAgentTicket:[Ticket]
getGroupMonthLocalTicket:[Ticket]
getGroupMonthMobileTicket:[Ticket]
getGroupMonthAgentTicketInbr:[Ticket]
getGroupMonthLocalTicketInbr:[Ticket]
getGroupMonthMobileTicketInbr:[Ticket]

}
`
module.exports=typeDefs
