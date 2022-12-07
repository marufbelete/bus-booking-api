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
 type sitInfo{
    source:String
    destination:String
    label:Int
    avgOpenSit:Float
    avgReservedSit:Float
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
getAgenTotalTicket(input:SaleInputFilter):Ticket
getLocalSpecificCanceledSale(input:SaleInputFilter):Ticket
getLocalSpecificTotalSale(input:SaleInputFilter):Ticket
getAgentTotalSale(input:SaleInputFilter):Ticket
getMobileTotalSale(input:SaleInputFilter):Ticket
getTotalSale(input:SaleInputFilter):Ticket

getEachAgentSale(input:SaleInputFilter):[Ticket]
getOneAgentSale(input:SaleInputFilter):[Ticket]
getGroupMonthAgentTicket:[Ticket]
getGroupMonthLocalTicket:[Ticket]
getGroupMonthMobileTicket:[Ticket]

getGroupAgentTicketInbr(input:SaleInputFilter):[Ticket]
getAgentTicketInbr(input:SaleInputFilter):[Ticket]
getGroupLocalTicketInbr(input:SaleInputFilter):[Ticket]
getCasherTicketInbr(input:SaleInputFilter):[Ticket]
getAgentCanceledTicket(input:SaleInputFilter):[Ticket]
getAgentCanceledTicketBirr(input:SaleInputFilter):[Ticket]
getGroupLocalSpecfcificTicketInbr(input:SaleInputFilter):[Ticket]
getGroupLocalSpecfcificCanceledTicketInbr(input:SaleInputFilter):[Ticket]
getGroupMobileTicketInbr(input:SaleInputFilter):[Ticket]
getGroupAllTicketInbr(input:SaleInputFilter):[Ticket]

getDaysInbr(input:SaleInputFilter):[DaysTicket]
getDaysAgentTicketInbr(input:SaleInputFilter):[Ticket]
getDaysLocalTicketInbr(input:SaleInputFilter):[Ticket]
getDaysMobileTicketInbr(input:SaleInputFilter):[Ticket]
getDaysAllTicketInbr(input:SaleInputFilter):[Ticket]

getAggregateSitReserve(input:SaleInputFilter):sitInfo
getRouteAggregateSitReserve(input:SaleInputFilter):[sitInfo]
}
`
module.exports=typeDefs
