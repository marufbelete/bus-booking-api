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
    bookedAt:Date
    label:Int
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
type DaysTicket{
    AgentTicket:[Ticket]
    MobileTicket:[Ticket]
    LocalTicket:[Ticket]
    AllTicket:[Ticket]
}

type Query{
getLocalTotalSale(input:SaleInputFilter):Ticket
getAgentTotalSale(input:SaleInputFilter):Ticket
getMobileTotalSale(input:SaleInputFilter):Ticket

getEachAgentSale(input:SaleInputFilter):[Ticket]
getGroupMonthAgentTicket:[Ticket]
getGroupMonthLocalTicket:[Ticket]
getGroupMonthMobileTicket:[Ticket]

getGroupAgentTicketInbr(input:SaleInputFilter):[Ticket]
getGroupLocalTicketInbr(input:SaleInputFilter):[Ticket]
getGroupMobileTicketInbr(input:SaleInputFilter):[Ticket]
getGroupAllTicketInbr(input:SaleInputFilter):[Ticket]

getDaysInbr(input:SaleInputFilter):[DaysTicket]
getDaysAgentTicketInbr(input:SaleInputFilter):[Ticket]
getDaysLocalTicketInbr(input:SaleInputFilter):[Ticket]
getDaysMobileTicketInbr(input:SaleInputFilter):[Ticket]
getDaysAllTicketInbr(input:SaleInputFilter):[Ticket]
}
`
module.exports=typeDefs
